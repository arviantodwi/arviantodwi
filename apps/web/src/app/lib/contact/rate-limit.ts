/**
 * In-memory, fixed-window rate limiter for the contact form.
 *
 * State lives at module level and survives across requests **in one
 * process only**. On lambda-style hosts it resets per cold start —
 * acceptable for a personal portfolio; no external store on purpose.
 */

/** Resolved, clamped rate-limit config. Read at call time from env. */
export interface RateLimitConfig {
  /** Submissions allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MIN = 10;
const MIN_LIMIT = 1;
const MIN_WINDOW_MIN = 1;

const hits = new Map<string, number[]>();

/**
 * Parse CONTACT_RATE_LIMIT + CONTACT_RATE_WINDOW_MIN from env.
 * Must be called at request time (not module top level) — Next only
 * inlines literal `process.env` reads, and values may change between
 * deploys. Returns clamped defaults on missing/malformed input — never
 * throws, never disables the limiter.
 */
export function readRateLimitConfig(): RateLimitConfig {
  return {
    limit: readClampedInt(process.env.CONTACT_RATE_LIMIT, DEFAULT_LIMIT, MIN_LIMIT),
    windowMs:
      readClampedInt(process.env.CONTACT_RATE_WINDOW_MIN, DEFAULT_WINDOW_MIN, MIN_WINDOW_MIN) *
      60_000,
  };
}

/**
 * Fixed-window check keyed by client IP. Records the hit only when
 * allowed — a blocked visitor retrying must not extend their own
 * lockout. Returns true = allowed, false = blocked.
 */
export function checkRateLimit(ip: string, config?: RateLimitConfig): boolean {
  const { limit, windowMs } = config ?? readRateLimitConfig();
  const now = Date.now();

  const previous = hits.get(ip);
  const recent = previous?.filter((timestamp) => now - timestamp < windowMs);

  if (recent && recent.length > 0) {
    hits.set(ip, recent);
  } else if (previous) {
    // Prune empty buckets to avoid unbounded growth.
    hits.delete(ip);
  }

  if ((recent?.length ?? 0) >= limit) {
    return false;
  }

  hits.set(ip, [...(recent ?? []), now]);
  return true;
}

/**
 * Parse a positive integer from an env value. `Number.parseInt` keeps
 * "5abc" → 5 and floors "5.5" → 5. NaN / <= 0 → the given default, and
 * values below `min` clamp up to `min` — never 0 (a zero-length window
 * or a zero limit would make the form unusable for everyone).
 */
function readClampedInt(value: string | undefined, fallback: number, min: number): number {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value.trim(), 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(parsed, min);
}
