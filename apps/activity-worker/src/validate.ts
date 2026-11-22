import type { Category } from './heuristic';
import { isCategory } from './heuristic';
import { toUtcIso } from './time';

/** Validated, normalized turn record ready for the categorization pipeline and upsert. */
export interface ValidTurn {
  sessionId: string;
  turnId: string;
  startedAt: string | null;
  endedAt: string;
  durationMs: number | null;
  prompts: number;
  toolCalls: number;
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
  title: string | null;
  firstPrompt: string | null;
  toolCounts: Record<string, number>;
  /** Forward-compat: accepted but no v1 client sends it; skips Jev when present. */
  category: Category | null;
}

const MAX_TURN_PAYLOAD = 64 * 1024; // decision 13
const MAX_BATCH = 50;

const okStr = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim() !== '' ? v.slice(0, max) : null;

const okInt = (v: unknown, max: number): number | null =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= max ? v : null;

/**
 * Validate and normalize one turn record. Malformed input is rejected with a
 * reason; timestamps are normalized to ISO 8601 UTC (…Z) per decision 15.
 */
export function validateTurn(
  raw: unknown,
): { ok: true; turn: ValidTurn } | { ok: false; error: string } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, error: 'turn must be an object' };
  }
  if (JSON.stringify(raw).length > MAX_TURN_PAYLOAD) {
    return { ok: false, error: 'turn payload exceeds 64 KB' };
  }
  const rec = raw as Record<string, unknown>;

  const sessionId = okStr(rec.sessionId, 200);
  const turnId = okStr(rec.turnId, 200);
  if (!sessionId) return { ok: false, error: 'sessionId is required (string, ≤ 200 chars)' };
  if (!turnId) return { ok: false, error: 'turnId is required (string, ≤ 200 chars)' };

  const endedAt = toUtcIso(rec.endedAt);
  if (!endedAt) return { ok: false, error: 'endedAt is required (epoch or ISO timestamp)' };
  const startedAtRaw = toUtcIso(rec.startedAt);
  const startedAt = startedAtRaw && startedAtRaw <= endedAt ? startedAtRaw : null;

  const providedDuration = okInt(rec.durationMs, 1e9);
  const derivedDuration =
    startedAtRaw !== null
      ? Math.max(0, Math.min(1e9, new Date(endedAt).getTime() - new Date(startedAtRaw).getTime()))
      : null;
  const durationMs = providedDuration ?? derivedDuration;

  const prompts = okInt(rec.prompts, 1e6) ?? 0;
  const toolCalls = okInt(rec.toolCalls, 1e6) ?? 0;

  const rawTokens = (
    typeof rec.tokens === 'object' && rec.tokens !== null ? rec.tokens : {}
  ) as Record<string, unknown>;
  const rawCache = (
    typeof rawTokens.cache === 'object' && rawTokens.cache !== null ? rawTokens.cache : {}
  ) as Record<string, unknown>;
  const cacheRead = okInt(rawCache.read, 1e10) ?? okInt(rawTokens.cacheRead, 1e10) ?? 0;
  const cacheWrite = okInt(rawCache.write, 1e10) ?? okInt(rawTokens.cacheWrite, 1e10) ?? 0;
  const input = okInt(rawTokens.input, 1e10) ?? 0;
  const output = okInt(rawTokens.output, 1e10) ?? 0;
  const reasoning = okInt(rawTokens.reasoning, 1e10) ?? 0;
  const total = okInt(rawTokens.total, 1e10) ?? input + output + reasoning + cacheRead + cacheWrite;

  const costUsd =
    typeof rec.costUsd === 'number' &&
    Number.isFinite(rec.costUsd) &&
    rec.costUsd >= 0 &&
    rec.costUsd <= 1e6
      ? Number(rec.costUsd.toFixed(6))
      : null;

  const toolCounts: Record<string, number> = {};
  if (
    typeof rec.toolCounts === 'object' &&
    rec.toolCounts !== null &&
    !Array.isArray(rec.toolCounts)
  ) {
    for (const [name, count] of Object.entries(rec.toolCounts as Record<string, unknown>)) {
      const n = okInt(count, 1e6);
      if (n !== null && Object.keys(toolCounts).length < 100) toolCounts[name.slice(0, 200)] = n;
    }
  }

  let category: Category | null = null;
  if (typeof rec.category === 'string' && isCategory(rec.category)) category = rec.category;

  return {
    ok: true,
    turn: {
      sessionId,
      turnId,
      startedAt,
      endedAt,
      durationMs,
      prompts,
      toolCalls,
      tokens: { input, output, reasoning, cacheRead, cacheWrite, total },
      costUsd,
      model: okStr(rec.model, 200),
      agent: okStr(rec.agent, 200),
      title: okStr(rec.title, 500),
      firstPrompt: okStr(rec.firstPrompt, 1000),
      toolCounts,
      category,
    },
  };
}

/** Normalize a request body into a list of turns; rejects the whole request when malformed. */
export function parseTurnsBody(
  body: unknown,
): { ok: true; turns: unknown[] } | { ok: false; error: string } {
  if (Array.isArray(body)) {
    if (body.length === 0) return { ok: false, error: 'empty batch' };
    if (body.length > MAX_BATCH) return { ok: false, error: `batch exceeds ${MAX_BATCH} turns` };
    return { ok: true, turns: body };
  }
  if (
    typeof body === 'object' &&
    body !== null &&
    Array.isArray((body as Record<string, unknown>).turns)
  ) {
    return parseTurnsBody((body as Record<string, unknown>).turns);
  }
  if (typeof body === 'object' && body !== null) return { ok: true, turns: [body] };
  return { ok: false, error: 'body must be a turn object, an array of turns, or { turns: [...] }' };
}
