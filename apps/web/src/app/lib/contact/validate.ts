/**
 * Pure, dependency-free validation + sanitization for the contact form.
 * Shared between the client (instant feedback) and the server action
 * (authoritative check). No I/O, never throws.
 */

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  interest: string;
};

export type ContactFieldError = 'required' | 'tooShort' | 'tooLong' | 'invalid';

export type ContactErrors = Partial<
  Record<'name' | 'email' | 'message' | 'interest', ContactFieldError>
>;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 1000 },
} as const;

export const INTERESTS = ['design', 'frontend', 'sme', 'hello'] as const;

/**
 * Deliberately permissive email pattern — RFC-perfect regexes reject
 * valid addresses. Resend re-validates the recipient server-side.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared email-shape check (used for the visitor address and CONTACT_FROM). */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * Strips control characters (Unicode category Cc, except \n and \t) and
 * collapses runs of whitespace into single spaces. Applied to single-line
 * fields (name/email/interest) before validation or email HTML. This also
 * neutralizes header injection in subject lines (no \r / \n survives).
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/[^\P{Cc}\n\t]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Message variant: same stripping, but line breaks SURVIVE — \r\n / \r /
 * U+2028 / U+2029 normalize to \n and horizontal whitespace (\t, space
 * runs) collapses. Breaks are trimmed ONLY at the leading/trailing edges
 * (via trim, covering runs of them); internal runs are kept verbatim.
 * The email builders turn each surviving \n into its own <p>; the
 * plain-text part keeps the raw \n. Subject-line injection stays
 * neutralized: name/email (the only values that reach headers) go
 * through sanitizeText, never this.
 */
export function sanitizeMessage(value: string): string {
  return value
    .replace(/\r\n?|[\u2028\u2029]/g, '\n')
    .replace(/[^\P{Cc}\n\t]+/gu, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .trim();
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  const name = input.name.trim();
  if (name.length === 0) {
    errors.name = 'required';
  } else if (name.length < LIMITS.name.min) {
    errors.name = 'tooShort';
  } else if (name.length > LIMITS.name.max) {
    errors.name = 'tooLong';
  }

  const email = input.email.trim();
  if (email.length === 0) {
    errors.email = 'required';
  } else if (email.length > LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    errors.email = 'invalid';
  }

  const message = input.message.trim();
  if (message.length === 0) {
    errors.message = 'required';
  } else if (message.length < LIMITS.message.min) {
    errors.message = 'tooShort';
  } else if (message.length > LIMITS.message.max) {
    errors.message = 'tooLong';
  }

  if (!INTERESTS.includes(input.interest as (typeof INTERESTS)[number])) {
    errors.interest = 'invalid';
  }

  return errors;
}
