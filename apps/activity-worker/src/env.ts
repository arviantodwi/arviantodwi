/**
 * Worker bindings. Secrets (AGENT_ACTIVITY_TOKEN, OPENROUTER_API_KEY) are
 * optional: the worker fails closed without the token and degrades to
 * heuristic-only categorization without the OpenRouter key.
 */
export interface Env {
  DB: D1Database;
  /** Bearer token guarding POST /activity/turns and POST /activity/mcp. */
  AGENT_ACTIVITY_TOKEN?: string;
  /** OpenRouter key for Jev classification; absent → heuristic-only mode. */
  OPENROUTER_API_KEY?: string;
  /** Display timezone for day bucketing (projection only, never stored as source of truth). */
  ACTIVITY_TZ?: string;
  /** Comma-separated origins allowed to read GET /activity/days via CORS. */
  ALLOWED_ORIGINS?: string;
}

export const activityTz = (env: Env): string => env.ACTIVITY_TZ || 'Asia/Jakarta';
