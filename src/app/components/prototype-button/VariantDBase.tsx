import type { FC, ReactNode } from 'react';
import { cx } from '@/app/lib/utils';

/* PROTOTYPE (button spec) — Variant D's base layer, split from VariantD so
   the contact send button's exhibit (ContactSend) can sit on the same
   frame instead of restating D's tokens.
   Spec finding carried by this split: a real ui/Button needs these same
   layers — tokens + frame reusable as-is under one prop set (variant,
   size, loading, disabled), plus an escape hatch for persistent custom
   loaders (trigger state-class on the button root; content that survives
   loading). Slot-swapped loaders can't host them: the contact send plane
   positions on its <path> transform precisely because the element must
   persist across idle/hover/loading — see the .send-btn block in
   globals.css. */

export type DVariantKey = 'primary' | 'secondary';
export type DSize = 'md' | 'lg' | 'flush' | 'icon-md' | 'icon-lg';

export const BASE =
  'relative inline-flex cursor-pointer overflow-hidden items-center justify-center gap-2 border backdrop-blur-sm font-general font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

export const VARIANT: Record<DVariantKey, string> = {
  /* Press snaps faster than hover (40ms vs 200ms) — the click reads
     immediate, the return eases back at the base duration. */
  primary:
    'border-gold/50 bg-gold/15 text-gold hover:border-gold hover:bg-gold/25 active:scale-[0.98] active:bg-gold/10 active:duration-40',
  secondary:
    'border-white/15 bg-white/[0.08] text-foreground hover:border-white/50 hover:bg-white/[0.16] active:scale-[0.98] active:bg-white/[0.06] active:duration-40',
};

/* No `disabled:cursor-*` here — see DFrame: cursor is prop-keyed, and a
   variant selector would out-bind every prop-keyed class on the pinned
   loading rows. */
export const STATES = 'disabled:scale-100';

export const SHAPE: Record<DSize, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  /* Flush pad: the send-row composition's Cancel mass (h-12, inset x) —
     the shipped Cancel's sizing on D's language. */
  flush: 'h-12 px-4 text-base',
  /* Icon-only squares: pad swaps out for a fixed square around the glyph. */
  'icon-md': 'size-10',
  'icon-lg': 'size-12',
};

export interface DFrameProps {
  variant?: DVariantKey;
  size?: DSize;
  loading?: boolean;
  disabled?: boolean;
  /* Trigger/state-class hooks for content whose choreography lives on the
     button root (e.g. send-btn / send-btn--loading). Appended last, so a
     caller can also override pad via a SHAPE-matching utility. */
  className?: string;
  children?: ReactNode;
}

/* The frame: everything about the button root — cursor choreography
   (pos progress while the custom loader drives, not-allowed when held
   down), aria-busy, press snap — with content left to callers. The cursor
   comes from the props ternary only: the DOM attr is derived from
   disabled || loading, so any `disabled:cursor-*` variant would
   out-bind it (higher specificity) and turn every pinned loading row
   not-allowed. Variant D's matrix Button and the contact send exhibit
   both ride it. */
export const DFrame: FC<DFrameProps> = ({
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  className,
  children,
}) => (
  <button
    type="button"
    aria-busy={loading || undefined}
    disabled={disabled || loading}
    className={cx(
      BASE,
      VARIANT[variant],
      SHAPE[size],
      STATES,
      disabled ? 'cursor-not-allowed opacity-40' : loading ? 'cursor-progress' : undefined,
      className,
    )}
  >
    {children}
  </button>
);

/* Loader slot vs canvas — the custom-animation contract:
   slot = layout truth (the icon slot's footprint, in flow, shrink-0), so
   the button keeps measuring its own label line and the SHAPE footprint
   (md/lg height) is authoritative — an in-flow oversized box would grow
   it (the D contact's 32px plane child once pushed lg from 48px to 56px).
   canvas = drawing truth, absolutely centered on the slot; it may exceed
   the slot only into the button's padding air space (md: ±4px vertical on
   a 10px pad, lg: same on 12px; horizontal into the gap + px pad) — never
   the flow. overflow-hidden never clips that: it cuts at the padding box.
   The slotted element must also persist across idle/hover/loading — the
   send plane positions on its <path> transform exactly because of that. */
export const LoaderSlot: FC<{
  slot?: number;
  canvas?: number;
  children?: ReactNode;
}> = ({ slot = 20, canvas, children }) => (
  <span className="relative inline-block shrink-0" style={{ width: slot, height: slot }}>
    {canvas === undefined ? (
      children
    ) : (
      <span
        className="absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2"
        style={{ width: canvas, height: canvas }}
      >
        {children}
      </span>
    )}
  </span>
);
