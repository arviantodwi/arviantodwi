import type { Category } from './heuristic';
import { CATEGORIES } from './heuristic';
import { dayBucket } from './time';

export type Range = { kind: 'all' } | { kind: 'last12' } | { kind: 'year'; year: string };

export function parseRange(raw: string | undefined): Range | null {
  if (raw === undefined || raw === '') return { kind: 'all' };
  if (raw === 'last12') return { kind: 'last12' };
  if (/^\d{4}$/.test(raw)) return { kind: 'year', year: raw };
  return null;
}

/** Today's calendar day in the display timezone, shifted back `years` years. */
function dayInTzShifted(tz: string, years: number): string {
  const parts = dayBucket(new Date().toISOString(), tz).split('-').map(Number);
  const shifted = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  shifted.setUTCFullYear(shifted.getUTCFullYear() - years);
  return shifted.toISOString().slice(0, 10);
}

function dayFilter(range: Range, tz: string): string | null {
  if (range.kind === 'last12') return `day >= '${dayInTzShifted(tz, 1)}'`;
  if (range.kind === 'year') return `day >= '${range.year}-01-01' AND day <= '${range.year}-12-31'`;
  return null;
}

export interface DayAggregate {
  date: string;
  tokens: number;
  prompts: number;
  toolCalls: number;
  minutes: number;
  turnCount: number;
  categories: Record<Category, number>;
}

export interface TurnRecord {
  day: string;
  startedAt: string | null;
  endedAt: string | null;
  durationMs: number | null;
  prompts: number;
  toolCalls: number;
  tokens: number;
  category: Category;
}

/**
 * Daily aggregates (SUM over turns) + per-turn numeric records. Numbers only:
 * no titles, no context, no prose (decision 5).
 */
export async function aggregate(
  db: D1Database,
  tz: string,
  range: Range,
): Promise<{ days: DayAggregate[]; turns: TurnRecord[] }> {
  const where = dayFilter(range, tz);
  const whereSql = where ? `WHERE ${where}` : '';

  const grouped = await db
    .prepare(
      `SELECT day, category, COUNT(*) AS n,
              COALESCE(SUM(prompts), 0) AS prompts,
              COALESCE(SUM(tool_calls), 0) AS tool_calls,
              COALESCE(SUM(tokens_total), 0) AS tokens,
              COALESCE(SUM(duration_ms), 0) AS duration_ms
       FROM agent_turns ${whereSql}
       GROUP BY day, category ORDER BY day`,
    )
    .all();

  const turnsResult = await db
    .prepare(
      `SELECT day, started_at, ended_at, duration_ms, prompts, tool_calls, tokens_total, category
       FROM agent_turns ${whereSql} ORDER BY started_at`,
    )
    .all();

  const byDay = new Map<string, DayAggregate>();
  const touch = (day: string): DayAggregate => {
    let dayEntry = byDay.get(day);
    if (!dayEntry) {
      dayEntry = {
        date: day,
        tokens: 0,
        prompts: 0,
        toolCalls: 0,
        minutes: 0,
        turnCount: 0,
        categories: Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>,
      };
      byDay.set(day, dayEntry);
    }
    return dayEntry;
  };

  for (const row of grouped.results as unknown as {
    day: string;
    category: string;
    n: number;
    prompts: number;
    tool_calls: number;
    tokens: number;
    duration_ms: number;
  }[]) {
    const dayEntry = touch(row.day);
    const category = (CATEGORIES as readonly string[]).includes(row.category)
      ? (row.category as Category)
      : 'other';
    dayEntry.tokens += row.tokens;
    dayEntry.prompts += row.prompts;
    dayEntry.toolCalls += row.tool_calls;
    dayEntry.minutes += row.duration_ms;
    dayEntry.turnCount += row.n;
    dayEntry.categories[category] += row.tokens;
  }
  for (const dayEntry of byDay.values())
    dayEntry.minutes = Math.round((dayEntry.minutes / 60000) * 10) / 10;

  const turns = (
    turnsResult.results as unknown as {
      day: string;
      started_at: string | null;
      ended_at: string | null;
      duration_ms: number | null;
      prompts: number;
      tool_calls: number;
      tokens_total: number;
      category: string;
    }[]
  ).map((row) => ({
    day: row.day,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    durationMs: row.duration_ms,
    prompts: row.prompts,
    toolCalls: row.tool_calls,
    tokens: row.tokens_total,
    category: (CATEGORIES as readonly string[]).includes(row.category)
      ? (row.category as Category)
      : 'other',
  }));

  return { days: [...byDay.values()], turns };
}
