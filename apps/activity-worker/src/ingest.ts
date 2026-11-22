import type { MiddlewareHandler } from 'hono';
import type { Env } from './env';
import { heuristicCategory, categoryMix, type Category } from './heuristic';
import { classifyWithJev, JEV_MIN_CONFIDENCE } from './jev';
import { dayBucket } from './time';
import type { ValidTurn } from './validate';

export interface CategorizedTurn {
  turn: ValidTurn;
  category: Category;
  categorySource: 'manual' | 'jev' | 'heuristic';
  categoryProbs: Record<string, number> | null;
}

/** Bearer auth for ingest + MCP. Fails closed when the token is not configured. */
export const requireBearer: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const expected = c.env.AGENT_ACTIVITY_TOKEN;
  if (!expected)
    return c.json({ error: 'Ingest not configured (missing AGENT_ACTIVITY_TOKEN)' }, 503);
  const got = c.req.header('Authorization');
  if (got !== `Bearer ${expected}`) return c.json({ error: 'Unauthorized' }, 401);
  await next();
};

/**
 * Assign a category to a turn. Flow: a forward-compat manual `category` wins;
 * otherwise Jev classifies from the digest and is accepted at ≥ 0.7
 * confidence; below threshold or on any failure the tool-mix heuristic stands
 * (decision 4). Never throws — Jev failure degrades to the heuristic.
 */
export async function categorizeTurn(turn: ValidTurn, env: Env): Promise<CategorizedTurn> {
  if (turn.category) {
    return { turn, category: turn.category, categorySource: 'manual', categoryProbs: null };
  }
  const heuristic = heuristicCategory(turn.toolCounts, turn.agent ?? undefined);
  const jev = await classifyWithJev(turn, env);
  if (jev && jev.confidence >= JEV_MIN_CONFIDENCE) {
    return { turn, category: jev.category, categorySource: 'jev', categoryProbs: jev.probs };
  }
  return { turn, category: heuristic, categorySource: 'heuristic', categoryProbs: null };
}

const UPSERT_SQL = `INSERT INTO agent_turns (
  source, session_id, turn_id, day, started_at, ended_at, duration_ms,
  prompts, tool_calls, tokens_input, tokens_output, tokens_reasoning,
  tokens_cache_read, tokens_cache_write, tokens_total, cost_usd,
  model, agent, title, category, category_source, category_probs, category_mix,
  created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT (source, session_id, turn_id) DO UPDATE SET
  day = excluded.day, started_at = excluded.started_at, ended_at = excluded.ended_at,
  duration_ms = excluded.duration_ms, prompts = excluded.prompts, tool_calls = excluded.tool_calls,
  tokens_input = excluded.tokens_input, tokens_output = excluded.tokens_output,
  tokens_reasoning = excluded.tokens_reasoning, tokens_cache_read = excluded.tokens_cache_read,
  tokens_cache_write = excluded.tokens_cache_write, tokens_total = excluded.tokens_total,
  cost_usd = excluded.cost_usd, model = excluded.model, agent = excluded.agent,
  title = excluded.title, category = excluded.category, category_source = excluded.category_source,
  category_probs = excluded.category_probs, category_mix = excluded.category_mix,
  updated_at = excluded.updated_at`;

/** Ingest + upsert an idempotent batch of categorized turns into D1. */
export async function upsertTurns(
  db: D1Database,
  turns: CategorizedTurn[],
  tz: string,
): Promise<void> {
  const now = new Date().toISOString();
  const statements = turns.map((entry) => {
    const { turn } = entry;
    const day = dayBucket(turn.endedAt, tz);
    return db
      .prepare(UPSERT_SQL)
      .bind(
        'opencode',
        turn.sessionId,
        turn.turnId,
        day,
        turn.startedAt,
        turn.endedAt,
        turn.durationMs,
        turn.prompts,
        turn.toolCalls,
        turn.tokens.input,
        turn.tokens.output,
        turn.tokens.reasoning,
        turn.tokens.cacheRead,
        turn.tokens.cacheWrite,
        turn.tokens.total,
        turn.costUsd,
        turn.model,
        turn.agent,
        turn.title,
        entry.category,
        entry.categorySource,
        entry.categoryProbs ? JSON.stringify(entry.categoryProbs) : null,
        JSON.stringify(categoryMix(turn.toolCounts)),
        now,
        now,
      );
  });
  await db.batch(statements);
}
