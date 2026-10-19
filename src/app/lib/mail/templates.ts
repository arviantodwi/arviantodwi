/**
 * Minimal inline-styled email builders for the contact form.
 * Full branded templates come later — keep this simple.
 *
 * All user input passes through escapeHtml() before it reaches the HTML
 * body (XSS boundary). Template copy is colocated here with an en/id
 * branch; email content is not part of the public i18n dictionaries.
 */

import { INTERESTS } from '../contact/validate';
import type { Locale } from '../i18n/types';

export interface OwnerNotificationArgs {
  name: string;
  email: string;
  interest: string;
  message: string;
  locale: Locale;
}

export interface VisitorAutoReplyArgs {
  name: string;
  locale: Locale;
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const INTEREST_LABELS: Record<Locale, Record<(typeof INTERESTS)[number], string>> = {
  en: {
    design: 'UI/UX Design',
    frontend: 'Front End Development',
    sme: 'UMKM (SME) Projects',
    hello: 'A quick hello!',
  },
  id: {
    design: 'Desain UI/UX',
    frontend: 'Pengembangan Front End',
    sme: 'Proyek UMKM',
    hello: 'Sapaan singkat!',
  },
};

/** Localized interest label for a submitted interest id; '—' fallback. */
export function interestLabel(interest: string, locale: Locale): string {
  const labels = INTEREST_LABELS[locale];
  return INTERESTS.includes(interest as (typeof INTERESTS)[number])
    ? labels[interest as (typeof INTERESTS)[number]]
    : '—';
}

/** Escapes &, <, >, " and ' — the boundary between user input and HTML. */
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const FONT_STACK = '-apple-system, "Segoe UI", Roboto, sans-serif';

function panel(content: string): string {
  return [
    `<div style="background-color:#0a0a0a;padding:32px;border-radius:8px;font-family:${FONT_STACK};color:#ffffff;line-height:1.6;">`,
    content,
    '</div>',
  ].join('');
}

function row(label: string, value: string): string {
  return `<p style="margin:0 0 8px;"><span style="color:#e4b600;font-weight:600;">${escapeHtml(label)}:</span> ${value}</p>`;
}

export function buildOwnerNotification(args: OwnerNotificationArgs): EmailContent {
  const { name, email, interest, message, locale } = args;
  const label = interestLabel(interest, locale);
  const t =
    locale === 'id'
      ? {
          subject: (n: string) => `Pesan baru: ${label} — ${n}`,
          heading: 'Pesan baru dari formulir kontak',
          from: 'Nama',
          fromEmail: 'Email',
          interest: 'Minat',
          message: 'Pesan',
          replyNote:
            'Tekan Balas (Reply) langsung untuk membalas pengunjung — Reply-To sudah mengarah ke email mereka.',
        }
      : {
          subject: (n: string) => `New contact: ${label} — ${n}`,
          heading: 'New message from your contact form',
          from: 'Name',
          fromEmail: 'Email',
          interest: 'Interest',
          message: 'Message',
          replyNote:
            'Hit Reply to answer the visitor directly — Reply-To is already set to their email address.',
        };

  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  return {
    subject: t.subject(name),
    html: panel(
      [
        `<h2 style="margin:0 0 16px;font-size:18px;">${t.heading}</h2>`,
        row(t.from, safeName),
        row(t.fromEmail, escapeHtml(email)),
        row(t.interest, escapeHtml(label)),
        row(t.message, safeMessage),
        `<p style="margin:16px 0 0;font-size:12px;color:#999999;">${t.replyNote}</p>`,
      ].join(''),
    ),
    text: [
      `${t.heading}`,
      `${t.from}: ${name}`,
      `${t.fromEmail}: ${email}`,
      `${t.interest}: ${label}`,
      `${t.message}: ${message}`,
      t.replyNote,
    ].join('\n'),
  };
}

export function buildVisitorAutoReply(args: VisitorAutoReplyArgs): EmailContent {
  const { name, locale } = args;
  const t =
    locale === 'id'
      ? {
          subject: 'Pesan Anda sudah diterima',
          thanks: `Hai ${name},`,
          body: 'Terima kasih sudah menghubungi saya. Pesan Anda sudah masuk, dan saya akan membalas segera setelah bisa.',
          signature: 'Salam,\nArvianto',
        }
      : {
          subject: 'Your message is on its way',
          thanks: `Hi ${name},`,
          body: "Thanks for reaching out. Your message just landed in my inbox, and I'll get back to you as soon as I can.",
          signature: 'Cheers,\nArvianto',
        };

  return {
    subject: t.subject,
    html: panel(
      [
        `<p style="margin:0 0 12px;">${escapeHtml(t.thanks)}</p>`,
        `<p style="margin:0 0 12px;">${t.body}</p>`,
        `<p style="margin:0;white-space:pre-line;color:#999999;">${escapeHtml(t.signature)}</p>`,
      ].join(''),
    ),
    text: [t.thanks, '', t.body, '', t.signature].join('\n'),
  };
}
