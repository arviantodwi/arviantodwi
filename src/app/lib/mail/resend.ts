import { Resend } from 'resend';

let client: Resend | null = null;

/**
 * Lazy singleton. Reads the API key at call time — never at module top
 * level (build-time inlining + "fail loudly, not crash" rule). Returns
 * null when RESEND_API_KEY is unset so the caller can surface a
 * friendly missing-config error instead of throwing.
 */
export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  client ??= new Resend(apiKey);
  return client;
}
