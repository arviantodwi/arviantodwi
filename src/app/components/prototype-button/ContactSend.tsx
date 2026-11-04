import type { FC } from 'react';
import { cx } from '@/app/lib/utils';
import { DFrame, LoaderSlot } from './VariantDBase';

/* PROTOTYPE (button spec) — the contact send button, twin-mounted in
   Variant D as the deliberate comparison exhibit for its exception status:
   the shipped contact frame keeps its own send-plane loading (never
   migrated into the shared button), so the matrix never carries it.
   Two skins, same mechanics — all animation rides on globals.css's
   .send-* rules, untouched:
   - CURRENT: verbatim ContactForm styling (flat gold, h-12 bold, 32×32
     plane+trails SVG, opacity hover) — the comparison baseline, restated
     here on purpose.
   - D: the same SVG and state choreography on Variant D's own frame
     (VariantDBase DFrame) — variant primary, size lg, trigger state-class
     drives the loading choreography on the root. The plane element
     persists across idle/hover/loading (slot-swap loaders can't host
     that), and it draws through the loader contract: a 20px slot (the
     unified glyph box) at the frame's lg footprint, a 32px canvas in the
     padding air space.
   Pinned loading rows loop the 3s cancel-window bar (proto-send-progress,
   infinite) so the sweep stays visible; ContactForm's own `forwards`
   one-shot remains exactly as shipped. */

const LABELS = { submit: 'Send Message', submitting: 'Sending…', cancel: 'Cancel' };

const PlaneSvg: FC = () => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <g className="send-fly">
      <path className="send-plane" d="M12 6l-4 4 6 6 4-16-18 7 4 2 2 6 3-4" />
    </g>
    <g transform="translate(7 19.3)">
      <path className="send-trail send-trail--1" pathLength={1} d="M5.3 -2.6L1.1 1.7" />
      <path className="send-trail send-trail--2" pathLength={1} d="M8 0L0.4 8.4" />
      <path className="send-trail send-trail--3" pathLength={1} d="M12.5 1.3L7.6 6.6" />
    </g>
  </svg>
);

const CURRENT_CANCEL =
  'border-foreground/70 font-general text-foreground/70 hover:border-foreground hover:text-foreground flex h-12 cursor-pointer items-center border px-4 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

interface ContactSendProps {
  /* Pins the counting/submitting state: label swap, plane top-right, bob,
     trails 2→1→3, purple 3s cancel-window bar + Cancel trigger. */
  loading?: boolean;
}

/** Shipped contact send button, verbatim from ContactForm. */
export const ContactSendCurrent: FC<ContactSendProps> = ({ loading = false }) => (
  <div className="flex items-center gap-4">
    {loading && (
      <button type="button" className={cx(CURRENT_CANCEL)}>
        {LABELS.cancel}
      </button>
    )}
    <div className="relative">
      <button
        type="button"
        disabled={loading}
        className={cx(
          'send-btn inline-flex h-12 items-center gap-2 bg-gold px-[18px] font-general font-bold text-base text-background transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
          loading ? 'cursor-progress' : 'cursor-pointer hover:opacity-90',
          loading && 'send-btn--loading',
        )}
      >
        {loading ? LABELS.submitting : LABELS.submit}
        <PlaneSvg />
      </button>
      {loading && (
        <span
          aria-hidden="true"
          className="send-progress-bar proto-send-progress absolute inset-x-0 -bottom-1.5 h-[3px] origin-left bg-[#9747FF]"
        />
      )}
    </div>
  </div>
);

/** Same send button on Variant D's own frame (see VariantDBase). */
export const ContactSendD: FC<ContactSendProps> = ({ loading = false }) => (
  <div className="flex items-center gap-4">
    {loading && (
      <DFrame variant="secondary" size="flush">
        {LABELS.cancel}
      </DFrame>
    )}
    <div className="relative">
      <DFrame
        variant="primary"
        size="lg"
        loading={loading}
        className={cx('send-btn', loading && 'send-btn--loading')}
      >
        {/* No explicit disabled — the frame attr-blocks clicks from loading
            itself, so the pinned counting state reads cursor-progress at
            full opacity, not the held-down look. */}
        {loading ? LABELS.submitting : LABELS.submit}
        {/* Plane rides the loader contract: the slot matches the unified
            20px glyph box (button stays at the frame's lg footprint, 48px,
            matching the shipped h-12), the 32px canvas draws the flight
            into the padding air space — big room is a custom-loader-only
            privilege. */}
        <LoaderSlot slot={20} canvas={32}>
          <PlaneSvg />
        </LoaderSlot>
      </DFrame>
      {loading && (
        <span
          aria-hidden="true"
          className="send-progress-bar proto-send-progress absolute inset-x-0 -bottom-1.5 h-[3px] origin-left bg-[#9747FF]"
        />
      )}
    </div>
  </div>
);
