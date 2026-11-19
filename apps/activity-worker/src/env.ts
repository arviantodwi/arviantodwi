/**
 * Worker bindings. Secrets (AGENT_ACTIVITY_TOKEN, JEV_API_KEY) are
 * optional: the worker fails closed without the token and degrades to
 * heuristic-only categorization without the OpenRouter key.
 */
export interface Env {
  DB: D1Database;
  /** Bearer token guarding POST /activity/turns and POST /activity/mcp. */
  AGENT_ACTIVITY_TOKEN?: string;
  /** Key for the Jev classification provider; absent → heuristic-only mode. */
  JEV_API_KEY?: string;
  /** Base URL of the Jev provider (OpenAI-compatible). */
  JEV_BASE_URL?: string;
  /** Display timezone for day bucketing (projection only, never stored as source of truth). */
  ACTIVITY_TZ?: string;
  /** Comma-separated origins allowed to read GET /activity/days via CORS. */
  ALLOWED_ORIGINS?: string;
}

export const activityTz = (env: Env): string => env.ACTIVITY_TZ || 'Asia/Jakarta';
export const jevBaseUrl = (env: Env): string =>
  (env.JEV_BASE_URL || 'https://ai.sumopod.com').replace(/\/$/, '');
