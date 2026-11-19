/**
 * Pure turn-slicing logic — no imports, so it runs under Node type-stripping
 * for tests and inside the OpenCode server alike.
 *
 * Model (decision 11): each `session.idle` closes exactly one turn. The plugin
 * slices only the messages after the last processed cursor, never accumulates
 * across turns, and POSTs one turn record per slice. Idempotency comes from
 * the turn key (opening message id) plus the durable cursor.
 */

export interface TurnMessage {
  id: string;
  type: string;
  created: number;
  text?: string;
  tokens?: {
    input?: number;
    output?: number;
    reasoning?: number;
    cache?: { read?: number; write?: number };
    cacheRead?: number;
    cacheWrite?: number;
  };
  cost?: number;
  model?: { providerID?: string; id?: string } | string;
  agent?: string;
  content?: Array<{ type?: string; name?: string; text?: string; tool?: string }>;
}

export interface SessionLike {
  parentID?: string | null;
  title?: string | null;
  agent?: string | null;
}

export interface TurnStats {
  turnId: string;
  startedAt: string | null;
  endedAt: string | null;
  durationMs: number | null;
  prompts: number;
  toolCalls: number;
  toolCounts: Record<string, number>;
  tokens: {
    input: number;
    output: number;
    reasoning: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
  };
  costUsd: number | null;
  model: string | null;
  agent: string | null;
  firstPrompt: string | null;
}

const METRIC_TYPES = new Set(['user', 'assistant']);
const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const msOrSeconds = (v: number): number => (v < 1e11 ? v * 1000 : v);
const iso = (v: number | null | undefined): string | null =>
  isFiniteNumber(v) ? new Date(msOrSeconds(v)).toISOString() : null;

/**
 * Normalize one transcript item into a TurnMessage. Tolerates both flat
 * message objects and wrapped `{ info, parts }` shapes.
 */
export function toTurnMessage(item: unknown): TurnMessage | null {
  if (typeof item !== 'object' || item === null) return null;
  const outer = item as Record<string, unknown>;
  const inner = (
    typeof outer.info === 'object' && outer.info !== null ? outer.info : outer
  ) as Record<string, unknown>;
  const id = typeof inner.id === 'string' ? inner.id : null;
  const type = typeof inner.type === 'string' ? inner.type : null;
  if (!id || !type) return null;
  const time = (typeof inner.time === 'object' && inner.time !== null ? inner.time : {}) as Record<
    string,
    unknown
  >;
  const parts = Array.isArray(inner.content)
    ? (inner.content as Record<string, unknown>[])
    : Array.isArray(outer.parts)
      ? (outer.parts as Record<string, unknown>[])
      : [];
  const text =
    typeof inner.text === 'string'
      ? inner.text
      : parts
          .filter((p) => p.type === 'text' && typeof p.text === 'string')
          .map((p) => p.text as string)
          .join(' ');
  const content = parts
    .filter((p) => p.type === 'tool' || p.type === 'reasoning')
    .map((p) => ({ type: p.type as string, name: (p.name ?? p.tool) as string | undefined }));
  const tokens =
    typeof inner.tokens === 'object' && inner.tokens !== null ? inner.tokens : undefined;
  const model = inner.model as TurnMessage['model'];
  return {
    id,
    type,
    created: isFiniteNumber(time.created) ? time.created : 0,
    text: text || undefined,
    tokens,
    cost: isFiniteNumber(inner.cost) ? inner.cost : undefined,
    model,
    agent: typeof inner.agent === 'string' ? inner.agent : undefined,
    content,
  };
}

/**
 * Slice the not-yet-processed portion of a transcript for one event.
 *
 * Idle event (turn closed): bounded slice — the metric messages between the
 * previous idle marker and the newest one; falls back to a tail slice when the
 * newest marker is not persisted yet (racy), which stays idempotent because
 * the turn key (opening message id) is unchanged. Execution events (failed /
 * interrupted): tail slice from the cursor. Only user/assistant messages carry
 * metrics; idle markers are excluded from stats but included in the cursor.
 */
export function findSlice(
  messages: TurnMessage[],
  cursorId: string | null,
  eventKind: 'idle' | 'execution',
): { stats: TurnStats; cursorId: string } | null {
  if (messages.length === 0) return null;
  const cursorIdx = cursorId ? messages.findIndex((m) => m.id === cursorId) : -1;
  let lastIdle = -1;
  for (let i = 0; i < messages.length; i++) if (messages[i].type === 'idle') lastIdle = i;

  let startIdx: number;
  let endIdx: number;
  if (eventKind === 'idle' && lastIdle >= 0 && cursorIdx < lastIdle) {
    let prevIdle = -1;
    for (let i = 0; i < lastIdle; i++) if (messages[i].type === 'idle') prevIdle = i;
    startIdx = prevIdle + 1;
    endIdx = lastIdle;
  } else {
    startIdx = cursorIdx >= 0 ? cursorIdx + 1 : lastIdle + 1;
    endIdx = messages.length - 1;
  }
  const slice = messages.slice(startIdx, endIdx + 1).filter((m) => METRIC_TYPES.has(m.type));
  if (slice.length === 0) return null;
  return { stats: computeStats(slice), cursorId: messages[endIdx].id };
}

function computeStats(slice: TurnMessage[]): TurnStats {
  const first = slice[0];
  const last = slice[slice.length - 1];
  const toolCounts: Record<string, number> = {};
  const tokens = { input: 0, output: 0, reasoning: 0, cacheRead: 0, cacheWrite: 0, total: 0 };
  let cost = 0;
  let prompts = 0;
  let toolCalls = 0;
  let model: string | null = null;
  let agent: string | null = null;
  let lastCompleted: number | null = null;

  for (const message of slice) {
    if (message.type === 'user') prompts += 1;
    if (message.type !== 'assistant') continue;
    if (isFiniteNumber(message.cost)) cost += message.cost;
    const t = message.tokens ?? {};
    const read = isFiniteNumber(t.cache?.read)
      ? t.cache?.read
      : isFiniteNumber(t.cacheRead)
        ? t.cacheRead
        : 0;
    const write = isFiniteNumber(t.cache?.write)
      ? t.cache?.write
      : isFiniteNumber(t.cacheWrite)
        ? t.cacheWrite
        : 0;
    tokens.input += isFiniteNumber(t.input) ? t.input : 0;
    tokens.output += isFiniteNumber(t.output) ? t.output : 0;
    tokens.reasoning += isFiniteNumber(t.reasoning) ? t.reasoning : 0;
    tokens.cacheRead += read;
    tokens.cacheWrite += write;
    if (typeof message.model === 'string') model = message.model;
    else if (message.model && typeof message.model === 'object') {
      const m = message.model;
      if (m.providerID && m.id) model = `${m.providerID}/${m.id}`;
    }
    if (message.agent) agent = message.agent;
    for (const part of message.content ?? []) {
      if (part.type !== 'tool' || !part.name) continue;
      toolCalls += 1;
      toolCounts[part.name] = (toolCounts[part.name] ?? 0) + 1;
    }
  }
  tokens.total =
    tokens.input + tokens.output + tokens.reasoning + tokens.cacheRead + tokens.cacheWrite;

  const startMs =
    isFiniteNumber(first.created) && first.created > 0 ? msOrSeconds(first.created) : null;
  const endMs =
    lastCompleted ??
    (isFiniteNumber(last.created) && last.created > 0 ? msOrSeconds(last.created) : null);
  const durationMs = startMs !== null && endMs !== null ? Math.max(0, endMs - startMs) : null;

  const firstUser = slice.find((m) => m.type === 'user');
  return {
    turnId: first.id,
    startedAt: iso(startMs),
    endedAt: iso(endMs),
    durationMs,
    prompts,
    toolCalls,
    toolCounts,
    tokens,
    costUsd: cost > 0 ? Number(cost.toFixed(6)) : null,
    model,
    agent,
    firstPrompt: firstUser?.text ? firstUser.text.slice(0, 500) : null,
  };
}
