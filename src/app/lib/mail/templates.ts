/**
 * Branded inline-styled email builders for the contact form.
 * Hand-rolled HTML strings — no email framework, deliberately lean
 * (3 small, stable templates). Design validated via the throwaway
 * prototype branch `prototype/branded-emails` (react-email harness,
 * owner verdict folded in here).
 *
 * Escape boundary: every user-supplied value passes through
 * escapeHtml() before it reaches the HTML body. Email copy is
 * colocated here with an en/id branch where needed; the owner
 * notification is EN-only regardless of the visitor's locale.
 *
 * Scheme handling: light values inline as the base (clients without
 * media-query support, e.g. Gmail/Outlook desktop, render these), dark
 * overrides in SCHEME_CSS via @media (prefers-color-scheme: dark)
 * (Apple Mail family honors it). Gmail lacks media queries and renders
 * the light base — same fallback logic applies to the logo swap pair.
 */

import { CV_URL, GITHUB_URL, LINKEDIN_URL } from '../constants';
import { INTERESTS } from '../contact/validate';
import type { Locale } from '../i18n/types';

export interface OwnerNotificationArgs {
  name: string;
  email: string;
  interest: string;
  message: string;
}

export interface VisitorAutoReplyArgs {
  name: string;
  locale: Locale;
  /** Owner inbox (CONTACT_TO) — shown as the "send more" address. */
  ownerEmail: string;
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const INTEREST_LABELS: Record<(typeof INTERESTS)[number], string> = {
  design: 'UI/UX Design',
  frontend: 'Front End Development',
  sme: 'UMKM (SME) Projects',
  hello: 'A quick hello!',
};

/** EN interest label for a submitted interest id; '—' fallback. */
function interestLabel(interest: string): string {
  return INTERESTS.includes(interest as (typeof INTERESTS)[number])
    ? INTEREST_LABELS[interest as (typeof INTERESTS)[number]]
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

const FONT_STACK =
  "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Hosted raster wordmark pair (transparent PNG — WebP breaks Outlook desktop and Gmail flattens its transparency). */
const SITE_ORIGIN = 'https://www.arvian.to';
const LOGO_ON_LIGHT = `${SITE_ORIGIN}/logo-raster-dark.png`; // black wordmark, light scheme
const LOGO_ON_DARK = `${SITE_ORIGIN}/logo-raster-light.png`; // white wordmark, dark scheme

/** Dark-scheme overrides — !important beats the inline light literals. */
const SCHEME_CSS = `
@media (prefers-color-scheme: dark) {
  .e-page { background-color: #040404 !important; }
  .e-card { background-color: #1a1a1a !important; border-color: rgba(255,255,255,0.08) !important; }
  .e-text { color: #ffffff !important; }
  .e-muted { color: rgba(255,255,255,0.6) !important; }
  .e-rule { border-color: rgba(255,255,255,0.15) !important; }
  .e-gold { color: #e4b600 !important; }
  .logo-on-light { display: none !important; }
  .logo-on-dark { display: block !important; }
}
`;

/** Full email document: head (font, scheme CSS) + 600px card table + footer note. */
function emailDocument(content: string, footerNote: string, lang: Locale): string {
  return [
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    `<html lang="${lang}" dir="ltr">`,
    '<head>',
    '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<meta name="color-scheme" content="light dark" />',
    '<meta name="supported-color-schemes" content="light dark" />',
    '<style>',
    "@font-face { font-family: 'Plus Jakarta Sans'; font-style: normal; font-weight: 400 700; src: url('https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2') format('woff2'); }",
    SCHEME_CSS,
    '</style>',
    '</head>',
    '<body class="e-page" bgcolor="#ffffff" style="margin:0;padding:0;background-color:#ffffff;">',
    '<table role="presentation" class="e-page" bgcolor="#ffffff" style="width:100%;background-color:#ffffff;border-collapse:collapse;"><tr>',
    `<td align="center" style="padding:28px 16px;font-family:${FONT_STACK};">`,
    '<table role="presentation" class="e-card" width="100%" bgcolor="#fafafa" style="width:100%;background-color:#fafafa;border:1px solid rgba(0,0,0,0.08);border-radius:8px;border-collapse:collapse;"><tr>',
    `<td style="padding:28px 20px 24px;font-family:${FONT_STACK};color:#171717;font-size:14px;line-height:22px;">`,
    content,
    '</td></tr></table>',
    footerNote,
    '</td></tr></table>',
    '</body>',
    '</html>',
  ].join('');
}

/** Scheme-swapped wordmark pair; the media query in SCHEME_CSS flips display. */
function brandRow(): string {
  const style = 'width:119px;height:22px;margin:0 0 20px;';
  return [
    `<img src="${LOGO_ON_LIGHT}" alt="arvian.to" width="119" height="22" class="logo-on-light" style="display:block;${style}" />`,
    `<img src="${LOGO_ON_DARK}" alt="" width="119" height="22" class="logo-on-dark" style="display:none;${style}" />`,
  ].join('');
}

function rule(bottom: string): string {
  return `<hr class="e-rule" style="border:none;border-top:1px solid rgba(0,0,0,0.12);margin:0 0 ${bottom};" />`;
}

function infoRow(label: string, value: string): string {
  return `<p class="e-text" style="margin:0 0 10px;color:#171717;font-size:14px;line-height:22px;"><span class="e-gold" style="color:#8f6f00;font-weight:700;">${escapeHtml(label)}: </span>${value}</p>`;
}

function footerNote(content: string): string {
  return `<p class="e-muted" style="margin:20px 0 8px;color:rgba(23,23,23,0.6);font-size:12px;line-height:18px;text-align:center;">${content}</p>`;
}

export function buildOwnerNotification(args: OwnerNotificationArgs): EmailContent {
  const { name, email, interest, message } = args;
  const label = interestLabel(interest);

  const content = [
    brandRow(),
    rule('24px'),
    '<h2 class="e-text" style="margin:0 0 24px;color:#171717;font-size:20px;line-height:28px;font-weight:700;">New message from your <span class="e-gold" style="color:#8f6f00;text-decoration:underline;text-underline-offset:5px;">contact form</span></h2>',
    infoRow('Name', escapeHtml(name)),
    infoRow('Email', escapeHtml(email)),
    infoRow('Interest', escapeHtml(label)),
    ...escapeHtml(message)
      .split('\n')
      .filter((line) => line.length > 0)
      .map(
        (line, index, lines) =>
          `<p class="e-text" style="margin:0 0 ${index === lines.length - 1 ? '0' : '12px'};color:#171717;font-size:14px;line-height:23px;">${line}</p>`,
      ),
  ].join('');

  return {
    subject: `New: ${name} – ${label}`,
    html: emailDocument(
      content,
      footerNote(
        'Hit Reply to answer the visitor directly. Reply-To is already set to their email address.',
      ),
      'en',
    ),
    text: [
      'New message from your contact form',
      `Name: ${name}`,
      `Email: ${email}`,
      `Interest: ${label}`,
      `Message: ${message}`,
      'Hit Reply to answer the visitor directly. Reply-To is already set to their email address.',
    ].join('\n'),
  };
}

export function buildVisitorAutoReply(args: VisitorAutoReplyArgs): EmailContent {
  const { name, locale, ownerEmail } = args;
  const t =
    locale === 'id'
      ? {
          subject: 'Pesan kamu sudah diterima',
          thanks: `Hai, ${name}`,
          noReplyPre:
            'Email ini dikirim dari alamat no-reply. Untuk mengirim pesan tambahan, silakan email ',
          body: 'Terima kasih sudah menghubungi saya. Pesan kamu sudah masuk, dan saya akan membalasnya sesegera mungkin.',
          signature: 'Salam,\nArvianto',
          notePre: 'Kamu menerima email ini karena kamu mengirim pesan lewat formulir kontak di ',
          noteLink: 'website Arvianto',
        }
      : {
          subject: 'Your message is on its way',
          thanks: `Hi, ${name}`,
          noReplyPre:
            'This email was sent from a no-reply address. To send additional messages, please email ',
          body: "Thanks for reaching out. Your message just landed in my inbox, and I'll get back to you as soon as I can.",
          signature: 'Cheers,\nArvianto',
          notePre: "You're receiving this because you used the contact form at ",
          noteLink: "Arvianto's website",
        };

  const linkStyle = 'color:#8f6f00;text-decoration:underline;text-underline-offset:3px;';
  const ownerLink = `<a href="mailto:${escapeHtml(ownerEmail)}" class="e-gold" style="${linkStyle}">${escapeHtml(ownerEmail)}</a>`;

  const content = [
    brandRow(),
    rule('24px'),
    `<p class="e-text" style="margin:0 0 12px;color:#171717;font-size:16px;font-weight:700;">${escapeHtml(t.thanks)}</p>`,
    `<p class="e-text" style="margin:0 0 16px;color:#171717;font-size:14px;line-height:23px;">${t.body}</p>`,
    `<p class="e-muted" style="margin:0;color:rgba(23,23,23,0.6);font-size:14px;line-height:22px;">${escapeHtml(t.signature).replaceAll('\n', '<br />')}</p>`,
    `<p class="e-muted" style="margin:16px 0 0;color:rgba(23,23,23,0.6);font-size:13px;font-style:italic;line-height:20px;">PS: ${t.noReplyPre}${ownerLink}.</p>`,
  ].join('');

  const socialLinks = [
    `<a href="${GITHUB_URL}" class="e-gold" style="${linkStyle}">GitHub</a>`,
    `<a href="${LINKEDIN_URL}" class="e-gold" style="${linkStyle}">LinkedIn</a>`,
    `<a href="${CV_URL}" class="e-gold" style="${linkStyle}">Download CV</a>`,
  ].join(' &nbsp;·&nbsp; ');

  return {
    subject: t.subject,
    html: emailDocument(
      content,
      [
        footerNote(
          `${t.notePre}<a href="${SITE_ORIGIN}" class="e-gold" style="${linkStyle}">${t.noteLink}</a>.`,
        ),
        footerNote(socialLinks),
      ].join(''),
      locale,
    ),
    text: [t.thanks, '', t.body, '', t.signature, '', `PS: ${t.noReplyPre}${ownerEmail}.`].join(
      '\n',
    ),
  };
}
