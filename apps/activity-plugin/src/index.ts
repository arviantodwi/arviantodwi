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
const config = (ctx: CtxLike): { url: string; token: string } | null => {
  const options = ctx.options ?? {};
  const url = options.url ?? process.env.AGENT_ACTIVITY_URL;
  const token = options.token ?? process.env.AGENT_ACTIVITY_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
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
  const sessionID = sessionIDOf(event);
  if (!sessionID) return;

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
  if (info.parentID) return;

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
  if (!slice) return; // nothing new (deduped, empty turn, or marker race resolved elsewhere)

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
  if (ok) await ctx.storage.set(storageKey, slice.cursorId);
  else
    console.warn(
      `${LOG} worker rejected the turn; will retry on the next event (cursor not advanced)`,
    );
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
    const controller = new AbortController();
    void (async () => {
      try {
        for await (const event of self.event.subscribe({
          types: ['session.idle', 'session.execution.failed', 'session.execution.interrupted'],
          signal: controller.signal,
        })) {
          void handleEvent(self, cfg, event).catch((error) =>
            console.error(`${LOG} event handler failed:`, error),
          );
        }
      } catch (error) {
        console.error(`${LOG} event subscription failed:`, error);
      }
    })();
    return () => controller.abort();
  },
});
