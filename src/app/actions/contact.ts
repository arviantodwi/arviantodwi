'use server';

import { headers } from 'next/headers';

import { checkRateLimit, readRateLimitConfig } from '@/app/lib/contact/rate-limit';
import {
  type ContactErrors,
  type ContactInput,
  isValidEmail,
  sanitizeMessage,
  sanitizeText,
  validateContact,
} from '@/app/lib/contact/validate';
import { hasLocale } from '@/app/lib/i18n';
import type { Locale } from '@/app/lib/i18n/types';
import { getResend } from '@/app/lib/mail/resend';
import { buildOwnerNotification, buildVisitorAutoReply } from '@/app/lib/mail/templates';

/** Minimal sender identity: shared address + per-email-type display name. */
function fromHeader(displayName: string, address: string): string {
  return displayName ? `${displayName} <${address}>` : address;
}

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors: ContactErrors;
  /** i18n KEY (e.g. 'contact.errors.rateLimited'), resolved client-side — never prose, never internals. */
  formError: string | null;
  /** Sanitized echo so fields repopulate on failure. */
  values: ContactInput;
};

export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values: ContactInput = {
    name: sanitizeText(asString(formData.get('name'))),
    email: sanitizeText(asString(formData.get('email'))),
    message: sanitizeMessage(asString(formData.get('message'))),
    interest: sanitizeText(asString(formData.get('interest'))),
  };

  const fail = (formError: string | null, fieldErrors: ContactErrors = {}): ContactFormState => ({
    status: 'error',
    fieldErrors,
    formError,
    values,
  });

  // 1. Rate limit (read env + record hit inside the limiter, per request).
  if (!checkRateLimit(await getClientIp(), readRateLimitConfig())) {
    return fail('contact.errors.rateLimited');
  }

  // 2. Time trap — humans cannot fill 4 fields in under 3s. Missing/NaN
  //    startedAt means a direct POST bypassing the form: same fake success.
  const startedAt = Number(asString(formData.get('startedAt')));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 3000) {
    return fakeSuccess(values);
  }

  // 3. Honeypot — hidden `company` field, invisible to humans.
  if (asString(formData.get('company')).length > 0) {
    return fakeSuccess(values);
  }

  // 4-5. Extract (done above) + sanitize (done inline). Validate.
  const fieldErrors = validateContact(values);
  if (Object.keys(fieldErrors).length > 0) {
    return fail(null, fieldErrors);
  }

  // 6. Locale (hidden field, untrusted).
  const localeRaw = asString(formData.get('locale'));
  const locale: Locale = hasLocale(localeRaw) ? localeRaw : 'en';

  // 7. Config check — missing or malformed config must surface as a
  //    friendly error, never a crash. Display names are optional (header
  //    falls back to the bare address); the shared address is required.
  const resend = getResend();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() ?? '';
  const to = process.env.CONTACT_TO?.trim() ?? '';
  const notificationName = process.env.CONTACT_NOTIFICATION_FROM_NAME?.trim() ?? '';
  const autoReplyName = process.env.CONTACT_AUTO_REPLY_FROM_NAME?.trim() ?? '';
  if (resend === null || !isValidEmail(fromEmail) || to.length === 0) {
    return fail('contact.errors.missingConfig');
  }

  // 8. Owner notification — EN-only regardless of the visitor's locale
  //    (the owner reads EN). Reply-To is the whole point: replying goes
  //    straight to the visitor.
  const ownerMail = buildOwnerNotification(values);
  try {
    const { error } = await resend.emails.send({
      from: fromHeader(notificationName, fromEmail),
      to: [to],
      subject: ownerMail.subject,
      html: ownerMail.html,
      text: ownerMail.text,
      replyTo: values.email,
    });
    if (error) {
      console.error('[contact] owner notification failed:', error);
      return fail('contact.errors.sendFailed');
    }
  } catch (error) {
    // Network-level failure only — API errors arrive as { error } above.
    console.error('[contact] owner notification request failed:', error);
    return fail('contact.errors.sendFailed');
  }

  // 9. Visitor auto-reply — best effort. The primary send already
  //    succeeded, so a failure here only logs; still return success.
  const autoReply = buildVisitorAutoReply({ name: values.name, locale, ownerEmail: to });
  try {
    const { error } = await resend.emails.send({
      from: fromHeader(autoReplyName, fromEmail),
      to: [values.email],
      subject: autoReply.subject,
      html: autoReply.html,
      text: autoReply.text,
    });
    if (error) {
      console.error('[contact] visitor auto-reply failed:', error);
    }
  } catch (error) {
    console.error('[contact] visitor auto-reply request failed:', error);
  }

  // 10. Success.
  return { status: 'success', fieldErrors: {}, formError: null, values };
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value : '';
}

/** Fake success for bot traps — indistinguishable from the real thing. */ /** Fake success for bot traps — indistinguishable from the real thing. */
function fakeSuccess(values: ContactInput): ContactFormState {
  return { status: 'success', fieldErrors: {}, formError: null, values };
}

/**
 * Best-effort client IP from proxy headers. Server Actions receive no
 * Request object, so headers() is the only source. Falls back to a
 * shared bucket — never logs the raw value.
 */
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return headerList.get('x-real-ip')?.trim() || 'unknown';
}
