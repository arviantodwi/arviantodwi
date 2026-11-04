import { Status, type StatusLabels } from '@/app/components/ui/AvailabilityStatus';

/**
 * Availability status resolved from environment variables (root `.env`
 * locally, project envs on Vercel). Five booleans under the `AVAIL_` prefix,
 * all following the same rule: empty, `false` or `0` (case-insensitive) is
 * off; anything else is on.
 *
 * Resolution is fail-closed — the badge starts red and only opens up:
 *
 * 1. `AVAIL_IS_CLOSED` on        → red (forced closed, the rare moment switch;
 *                                   delete the var to go back to normal flow)
 * 2. `AVAIL_LOOKING_FOR_JOB` on  → green (actively job hunting)
 * 3. `AVAIL_FREELANCE` / `AVAIL_PARTNERSHIP` / `AVAIL_OPEN_TO_OFFER`
 *    — any one on                → yellow; the active ones drive the composed
 *                                  label ("Open to freelance & new offers")
 * 4. nothing set                 → red (safe default, same as the old
 *                                  hardcoded state)
 *
 * Must be called at request/render time (not module top level) — Next only
 * inlines literal `process.env` reads, and values change between deploys.
 * The status is baked into the prerendered HTML, so a change requires a
 * redeploy to go live.
 */

export interface OpenLabelStrings {
  /** Leading text of the yellow label, e.g. "Open to". */
  prefix: string;
  /** Separator between list items when there are 3+, e.g. ",". */
  comma: string;
  /** Joiner before the final list item, e.g. "&" or "dan". */
  and: string;
  /** Noun for AVAIL_FREELANCE. */
  freelance: string;
  /** Noun for AVAIL_PARTNERSHIP. */
  partnership: string;
  /** Noun for AVAIL_OPEN_TO_OFFER. */
  offer: string;
}

/** The dictionary strings the resolver turns into badge labels. */
export interface StatusStrings {
  available: string;
  unavailable: string;
  open: OpenLabelStrings;
}

/** Fully resolved badge state — serializable (crosses into client components). */
export interface Availability {
  status: Status;
  labels: StatusLabels;
}

type OpenType = 'freelance' | 'partnership' | 'offer';

/**
 * Resolve the availability status + label strings from env.
 * Run in a server component only — client bundles never see these vars.
 */
export function getAvailability(strings: StatusStrings): Availability {
  if (readFlag(process.env.AVAIL_IS_CLOSED)) {
    return build(strings, Status.UNAVAILABLE, []);
  }

  if (readFlag(process.env.AVAIL_LOOKING_FOR_JOB)) {
    // Green wins over the open-type toggles (label ignores them too).
    return build(strings, Status.AVAILABLE, []);
  }

  const active: OpenType[] = [];
  if (readFlag(process.env.AVAIL_FREELANCE)) active.push('freelance');
  if (readFlag(process.env.AVAIL_PARTNERSHIP)) active.push('partnership');
  if (readFlag(process.env.AVAIL_OPEN_TO_OFFER)) active.push('offer');

  return build(strings, active.length > 0 ? Status.OPEN : Status.UNAVAILABLE, active);
}

function build(strings: StatusStrings, status: Status, active: OpenType[]): Availability {
  return {
    status,
    labels: {
      available: strings.available,
      open: composeOpenLabel(strings.open, active),
      unavailable: strings.unavailable,
    },
  };
}

/**
 * Yellow label lists the active open-type toggles in fixed order
 * (freelance, partnership, offer): 1 item → "Open to freelance",
 * 2 → "freelance & new offers", 3 → "freelance, partnership & new offers".
 */
function composeOpenLabel(strings: OpenLabelStrings, active: OpenType[]): string {
  const nouns: Record<OpenType, string> = {
    freelance: strings.freelance,
    partnership: strings.partnership,
    offer: strings.offer,
  };

  const items = active.map((type) => nouns[type]);

  if (items.length === 1) return `${strings.prefix} ${items[0]}`;

  const head = items.slice(0, -1).join(`${strings.comma} `);
  const last = items[items.length - 1];
  return `${strings.prefix} ${head} ${strings.and} ${last}`;
}

/**
 * Boolean env read shared by every AVAIL_* var: empty / `false` / `0`
 * (case-insensitive) is off, anything else on.
 */
function readFlag(raw: string | undefined): boolean {
  const value = raw?.trim().toLowerCase() ?? '';
  return value !== '' && value !== 'false' && value !== '0';
}
