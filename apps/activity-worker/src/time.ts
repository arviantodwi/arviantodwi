/**
 * Time policy (decision 15): the database stores ISO 8601 UTC (…Z) only.
 * `day` is a derived projection in ACTIVITY_TZ, never a source of truth.
 */

/** Normalize an incoming timestamp (epoch seconds/ms or ISO string) to ISO 8601 UTC (…Z), or null. */
export function toUtcIso(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    // Heuristic: values below 1e11 are seconds, larger ones milliseconds.
    const ms = value < 1e11 ? value * 1000 : value;
    return new Date(ms).toISOString();
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return null;
}

/** Project a UTC ISO timestamp onto a calendar day in the display timezone ('YYYY-MM-DD'). */
export function dayBucket(utcIso: string, tz: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(utcIso));
}
