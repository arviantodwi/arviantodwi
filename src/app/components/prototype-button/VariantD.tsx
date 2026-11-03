import type { CSSProperties, FC } from 'react';
import { cx } from '@/app/lib/utils';
import { IconArrowUpRight, IconBrandGithub } from '../ui/icons';
import { Matrix, type ProtoButtonProps, type ProtoIcon } from './Matrix';

/* PROTOTYPE (button spec) — Variant D: variant C's frost glass at the
   site's sharp-corner shape. Same glass language (translucent fill +
   hairline border, gold primary / neutral secondary) with square corners,
   40ms press snap, and a theme-native loader: three dots in a discrete
   steps() chase (the plan-marker / dev-caret idiom) instead of a generic
   spinner — no face overlay motion on loading. */

const PROTO_ICONS: Record<ProtoIcon, FC<{ size?: number }>> = {
  'arrow-up-right': IconArrowUpRight,
  'brand-github': IconBrandGithub,
};

const BASE =
  'relative inline-flex cursor-pointer overflow-hidden items-center justify-center gap-2 border backdrop-blur-sm font-general font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const VARIANT: Record<'primary' | 'secondary', string> = {
  /* Press snaps faster than hover (40ms vs 200ms) — the click reads
     immediate, the return eases back at the base duration. */
  primary:
    'border-gold/50 bg-gold/15 text-gold hover:border-gold hover:bg-gold/25 active:scale-[0.98] active:bg-gold/10 active:duration-40',
  secondary:
    'border-white/15 bg-white/[0.08] text-foreground hover:border-white/50 hover:bg-white/[0.16] active:scale-[0.98] active:bg-white/[0.06] active:duration-40',
};

const STATES = 'disabled:cursor-not-allowed disabled:scale-100';

const SHAPE: Record<'md' | 'lg', string> = { md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
const ICON_ONLY = { md: 'size-10', lg: 'size-12' };

/* Loader: one shared timeline, four dots. Each dot carries its own
   (ax, ay) = its starting corner and (bx, by) = the next corner clockwise,
   so a single keyframes drives the whole sequence:
   sit collapsed at center → burst to corners → slide one corner clockwise
   while morphing square→circle → collapse back to center keeping circles
   → morph circle→square at center → hold → loop.
   Takes the button's currentColor, so primary reads gold and secondary
   reads label-white. */
const CORNERS_UNIT: Array<[number, number, number, number]> = [
  [-1, -1, 1, -1], // tl → tr
  [1, -1, 1, 1], // tr → br
  [1, 1, -1, 1], // br → bl
  [-1, 1, -1, -1], // bl → tl
];
const dotStyle = (
  [ax, ay, bx, by]: (typeof CORNERS_UNIT)[number],
  offset: number,
  drop1: number,
  drop2: number,
): CSSProperties =>
  ({
    '--ax': `${ax * offset}px`,
    '--ay': `${ay * offset}px`,
    '--bx': `${bx * offset}px`,
    '--by': `${by * offset}px`,
    '--drop1': `${drop1}px`,
    '--drop2': `${drop2}px`,
  }) as CSSProperties;

const Loader: FC<{ margin?: 2 | 3 }> = ({ margin = 3 }) => {
  /* 20px box, 4px dots (2px half-size): margin 3 → ±5px (14×14),
     margin 2 → ±6px (16×16). */
  const offset = margin === 2 ? 6 : 5;
  const drop1 = margin === 2 ? 6 : 5;
  const drop2 = margin === 2 ? 3.5 : 3;
  return (
    <span aria-hidden="true" className="relative block size-5 shrink-0">
      {CORNERS_UNIT.map((corner) => (
        <span
          key={corner.join(',')}
          className="proto-morph-dot absolute top-1/2 left-1/2 -mt-[2px] -ml-[2px] size-1 bg-current"
          style={dotStyle(corner, offset, drop1, drop2)}
        />
      ))}
    </span>
  );
};

const Button: FC<ProtoButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  icon,
  iconPosition = 'trailing',
  iconOnly,
  loading,
  disabled,
  loaderMargin = 3,
}) => {
  const Icon = icon ? PROTO_ICONS[icon] : null;
  const classes = cx(
    BASE,
    VARIANT[variant],
    iconOnly ? ICON_ONLY[size] : SHAPE[size],
    STATES,
    disabled ? 'cursor-not-allowed opacity-40' : loading ? 'cursor-progress' : undefined,
  );

  const content = iconOnly ? (
    icon ? (
      <>
        {loading ? <Loader margin={loaderMargin} /> : Icon !== null && <Icon size={20} />}
        <span className="sr-only">{label}</span>
      </>
    ) : (
      label
    )
  ) : (
    <>
      {/* Loader takes over the icon's own slot — it sits where the icon
          would sit (leading → before text, trailing → after text), so the
          layout never shifts when loading starts. */}
      {iconPosition === 'leading' &&
        (loading ? <Loader margin={loaderMargin} /> : Icon !== null && <Icon size={18} />)}
      <span>{label}</span>
      {iconPosition === 'trailing' &&
        (loading ? (
          <Loader margin={loaderMargin} />
        ) : (
          Icon !== null && <Icon size={18} aria-hidden="true" />
        ))}
    </>
  );

  return (
    <button
      type="button"
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={classes}
    >
      {content}
    </button>
  );
};

export const VariantD = () => <Matrix button={Button} />;
