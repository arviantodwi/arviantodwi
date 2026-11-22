import { appendFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { Plugin } from '@opencode/plugin';
import { findSlice, toTurnMessage, type TurnMessage } from './turn.ts';

/**
 * Global OpenCode plugin: pushes one turn record per closed turn to the
 * activity worker.
 *
 * Trigger set (verified empirically 2026-11-22 against OpenCode v2.3.2):
 * `session.idle` never fires in the runtime's event stream — turn completion
 * is marked by the durable execution-terminal events instead:
 *   `session.execution.succeeded` | `.failed` | `.interrupted`
 * Idempotent by turn key + durable cursor, so repeats are free. Never throws
 * into the session loop — all failures are logged and swallowed.
 */

interface PluginOptions {
  url?: string;
  token?: string;
}

interface EventLike {
  type?: string;
  data?: { sessionID?: string };
  properties?: { sessionID?: string };
  location?: { directory?: string };
}

interface CtxLike {
  options?: PluginOptions;
  location?: { directory?: string };
  event: {
    subscribe(options: { types: string[]; signal?: AbortSignal }): AsyncIterable<unknown>;
  };
  session: {
    get(input: { sessionID: string }): Promise<unknown>;
    context(input: { sessionID: string }): Promise<unknown>;
  };
  storage: {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
  };
}

const LOG = '[agent-activity]';
/** Local diagnostic trail (ids/outcomes only — never prompt text or tokens). Owner-home, tiny. */
const DIAG_LOG = `${homedir()}/.agent-activity.plugin.log`;
const diag = (line: string): void => {
  void appendFile(DIAG_LOG, `${new Date().toISOString()} ${line}\n`).catch(() => {});
};

const TRIGGER_TYPES = [
  'session.execution.succeeded',
  'session.execution.failed',
  'session.execution.interrupted',
];

/** Resolve an `{env:VAR_NAME}` reference against the server process environment. */
const resolveEnvRef = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const match = value.match(/^\{env:([A-Za-z_][A-Za-z0-9_]*)\}$/);
  return match ? process.env[match[1]] : value;
};
const config = (ctx: CtxLike): { url: string; token: string } | null => {
  const options = ctx.options ?? {};
  const url = resolveEnvRef(options.url) ?? process.env.AGENT_ACTIVITY_URL;
  const token = resolveEnvRef(options.token) ?? process.env.AGENT_ACTIVITY_TOKEN;
  if (!url || !token) return null;
  // {file:} substitution can carry trailing whitespace/newlines — trim defensively.
  return { url: url.trim().replace(/\/$/, ''), token: token.trim() };
};

const sessionIDOf = (event: unknown): string | null => {
  const e = event as EventLike;
  return e.data?.sessionID ?? e.properties?.sessionID ?? null;
};

// Trigger → slice kind. `session.execution.succeeded` coincides with the runtime
// appending an `idle` marker message to the transcript (verified 2026-11-22: the
// marker lands ~7 ms before the event is handled) → use the bounded idle-marker
// slice, or a fresh session (no cursor yet) would slice past the newest marker
// into nothing and never capture a turn. failed / interrupted keep the
// tail-from-cursor slice.
const eventKindOf = (eventType: string): 'idle' | 'execution' =>
  eventType === 'session.execution.succeeded' ? 'idle' : 'execution';

async function postTurn(
  url: string,
  token: string,
  payload: unknown,
): Promise<{ ok: boolean; category?: string; categorySource?: string }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return { ok: false };
    const data = (await response.json()) as {
      turns?: Array<{ category?: string; categorySource?: string }>;
    };
    const first = data.turns?.[0];
    return { ok: true, category: first?.category, categorySource: first?.categorySource };
  } catch {
    return { ok: false };
  }
}

async function handleEvent(
  ctx: CtxLike,
  cfg: { url: string; token: string },
  event: unknown,
): Promise<void> {
  try {
    const e = event as EventLike;
    const eventType = e.type ?? 'unknown';
    // Scope to this plugin instance's own location: every loaded location runs
    // an instance and receives every event — without this guard each turn
    // would be processed N times (worker dedupes, but the transcript fetches
    // and Jev calls multiply).
    const eventDir = e.location?.directory;
    const ownDir = ctx.location?.directory;
    if (eventDir && ownDir && eventDir !== ownDir) return;

    const sessionID = sessionIDOf(event);
    if (!sessionID) {
      diag(`event=${eventType} skipped: no sessionID in payload`);
      return;
    }

    const session = (await ctx.session.get({ sessionID })) as
      | {
          parentID?: string | null;
          title?: string | null;
          agent?: string | null;
          data?: { parentID?: string | null; title?: string | null; agent?: string | null };
        }
      | undefined;
    const info = session?.data ?? session ?? {};
    // Decision 9: subagent sessions are skipped entirely.
    if (info.parentID) {
      diag(`event=${eventType} session=${sessionID.slice(0, 16)}… skipped: subagent`);
      return;
    }

    const transcript = await ctx.session.context({ sessionID });
    const rawItems: unknown[] = Array.isArray(transcript)
      ? transcript
      : ((transcript as { data?: unknown[]; messages?: unknown[] })?.data ??
        (transcript as { messages?: unknown[] })?.messages ??
        []);
    const messages = rawItems.map(toTurnMessage).filter((m): m is TurnMessage => m !== null);
    if (messages.length === 0) {
      diag(`event=${eventType} session=${sessionID.slice(0, 16)}… skipped: empty transcript`);
      return;
    }

    const storageKey = `turn/${sessionID}`;
    const stored = await ctx.storage.get(storageKey);
    const cursorId = typeof stored === 'string' ? stored : null;
    const slice = findSlice(messages, cursorId, eventKindOf(eventType));
    if (!slice) {
      diag(
        `event=${eventType} session=${sessionID.slice(0, 16)}… skipped: no new turn (deduped or empty)`,
      );
      return; // nothing new (deduped, empty turn, or marker race resolved elsewhere)
    }

    const result = await postTurn(cfg.url, cfg.token, {
      source: 'opencode',
      sessionId: sessionID,
      turnId: slice.stats.turnId,
      startedAt: slice.stats.startedAt,
      endedAt: slice.stats.endedAt,
      durationMs: slice.stats.durationMs,
      prompts: slice.stats.prompts,
      toolCalls: slice.stats.toolCalls,
      toolCounts: slice.stats.toolCounts,
      tokens: slice.stats.tokens,
      costUsd: slice.stats.costUsd,
      model: slice.stats.model,
      agent: slice.stats.agent ?? info.agent ?? null,
      title: info.title ?? null,
      firstPrompt: slice.stats.firstPrompt,
    });
    if (result.ok) {
      await ctx.storage.set(storageKey, slice.cursorId);
      diag(
        `event=${eventType} session=${sessionID.slice(0, 16)}… posted turn=${slice.stats.turnId.slice(0, 24)} category=${result.category ?? '?'} (${result.categorySource ?? '?'}) prompts=${slice.stats.prompts} toolCalls=${slice.stats.toolCalls} tokens=${slice.stats.tokens.total}`,
      );
    } else {
      diag(
        `event=${eventType} session=${sessionID.slice(0, 16)}… turn=${slice.stats.turnId.slice(0, 24)} POST FAILED (cursor not advanced; retries next event)`,
      );
      console.warn(
        `${LOG} worker rejected the turn; will retry on the next event (cursor not advanced)`,
      );
    }
  } catch (error) {
    const eventType = (event as EventLike).type ?? 'unknown';
    diag(
      `event=${eventType} handler error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export default Plugin.define({
  id: 'agent-activity',
  async setup(ctx) {
    const self = ctx as unknown as CtxLike;
    const cfg = config(self);
    if (!cfg) {
      console.warn(
        `${LOG} dormant — set AGENT_ACTIVITY_URL and AGENT_ACTIVITY_TOKEN in the environment, or { url, token } plugin options`,
      );
      diag('setup: dormant (no url/token configured)');
      return;
    }
    console.log(`${LOG} armed → ${cfg.url}`);
    diag(`setup: armed → ${cfg.url} (triggers: execution-terminal events)`);
    const controller = new AbortController();
    void (async () => {
      try {
        for await (const event of self.event.subscribe({
          types: TRIGGER_TYPES,
          signal: controller.signal,
        })) {
          void handleEvent(self, cfg, event).catch((error) => {
            diag(`event dispatch error: ${error instanceof Error ? error.message : String(error)}`);
            console.error(`${LOG} event handler failed:`, error);
          });
        }
      } catch (error) {
        diag(`subscription failed: ${error instanceof Error ? error.message : String(error)}`);
        console.error(`${LOG} event subscription failed:`, error);
      }
    })();
    return () => controller.abort();
  },
});
