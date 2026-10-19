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
  message: { min: 10, max: 5000 },
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
 * collapses runs of whitespace into single spaces. Applied to every
 * field before it reaches validation or email HTML. This also neutralizes
 * header injection in subject lines (no \r / \n survives).
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/[^\P{Cc}\n\t]+/gu, ' ')
    .replace(/\s+/g, ' ')
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
