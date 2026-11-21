import { appendFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { Plugin } from '@opencode/plugin';
import { findSlice, toTurnMessage, type TurnMessage } from './turn.ts';

/**
 * Global OpenCode plugin: pushes one turn record per closed turn to the
 * activity worker. Trigger set (decision 10): `session.idle` (primary) +
 * `session.execution.failed` / `session.execution.interrupted` (safety net).
 * Idempotent by turn key + durable cursor, so extra events cost nothing.
 * Never throws into the session loop — all failures are logged and swallowed.
 */

interface PluginOptions {
  url?: string;
  token?: string;
}

interface EventLike {
  type?: string;
  data?: { sessionID?: string };
  properties?: { sessionID?: string };
}

interface CtxLike {
  options?: PluginOptions;
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

const eventKindOf = (type: string | undefined): 'idle' | 'execution' =>
  type === 'session.idle' ? 'idle' : 'execution';

async function postTurn(url: string, token: string, payload: unknown): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function handleEvent(
  ctx: CtxLike,
  cfg: { url: string; token: string },
  event: unknown,
): Promise<void> {
  const eventType = (event as EventLike).type ?? 'unknown';
  // TEMP diagnostics: accept all session.* events (type filter disabled in
  // setup) and log every step, so capture failures are visible in the trail.
  if (!eventType.startsWith('session.')) return;
  diag(`received event=${eventType}`);
  try {
    await handleSessionEvent(ctx, cfg, eventType, event);
  } catch (error) {
    diag(
      `event=${eventType} handler error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function handleSessionEvent(
  ctx: CtxLike,
  cfg: { url: string; token: string },
  eventType: string,
  event: unknown,
): Promise<void> {
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
  if (messages.length === 0) return;

  const storageKey = `turn/${sessionID}`;
  const cursorId =
    typeof (await ctx.storage.get(storageKey)) === 'string'
      ? ((await ctx.storage.get(storageKey)) as string)
      : null;
  const eventKind = eventKindOf((event as EventLike).type);
  const slice = findSlice(messages, cursorId, eventKind);
  if (!slice) {
    diag(
      `event=${eventType} session=${sessionID.slice(0, 16)}… skipped: no new turn (deduped or empty)`,
    );
    return; // nothing new (deduped, empty turn, or marker race resolved elsewhere)
  }

  const ok = await postTurn(cfg.url, cfg.token, {
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
  if (ok) {
    await ctx.storage.set(storageKey, slice.cursorId);
    diag(
      `event=${eventType} session=${sessionID.slice(0, 16)}… posted turn=${slice.stats.turnId.slice(0, 24)} prompts=${slice.stats.prompts} toolCalls=${slice.stats.toolCalls} tokens=${slice.stats.tokens.total}`,
    );
  } else {
    diag(
      `event=${eventType} session=${sessionID.slice(0, 16)}… turn=${slice.stats.turnId.slice(0, 24)} POST FAILED (cursor not advanced; retries next event)`,
    );
    console.warn(
      `${LOG} worker rejected the turn; will retry on the next event (cursor not advanced)`,
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
      return;
    }
    console.log(`${LOG} armed → ${cfg.url}`);
    diag('setup: subscribing (all events, diagnostic filter in handler)');
    const controller = new AbortController();
    void (async () => {
      try {
        for await (const event of self.event.subscribe({
          // TEMP diagnostics: no type filter — log actual event names, then restore.
          signal: controller.signal,
        })) {
          void handleEvent(self, cfg, event).catch((error) =>
            console.error(`${LOG} event handler failed:`, error),
          );
        }
      } catch (error) {
        diag(`subscription failed: ${error instanceof Error ? error.message : String(error)}`);
        console.error(`${LOG} event subscription failed:`, error);
      }
    })();
    return () => controller.abort();
  },
});
