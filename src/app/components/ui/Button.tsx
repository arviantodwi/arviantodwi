import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  FC,
  ReactNode,
} from 'react';
import { cx } from '@/app/lib/utils';
import { IconArrowUpRight, IconBrandGithub } from './icons';

/* Sharp glass — validated by the button-spec prototype (variant D, capture
   commit bfe9390 on chore/optimization-20261103): the frost-glass idiom at
   the site's sharp-corner shape. Translucent fill + hairline border, gold
   primary / neutral secondary, backdrop blur, 200ms base duration with a
   40ms press snap. Loading is theme-native: a 4-dot morphogram in the
   icon slot (below), never a generic spinner, never a face-overlay
   motion.
   Layered contract, per the prototype's finding:
   - frame (ButtonFrame): tokens + root behavior, content-agnostic;
   - content (Button): structured label/icon/iconOnly, with the loader
     slot-swapping into the icon's own slot — zero layout shift;
   - custom-loader escape hatch (LoaderSlot + root trigger class): for
     compositions whose loading animation must persist across idle/hover/
     loading (a slot-swap unmounts the element and kills its transitions —
     the contact send plane positions on its <path> transform exactly
     because of that). The contact send button is the real consumer: it
     rides ButtonFrame + LoaderSlot with a send-btn trigger class and is
     deliberately NOT migrated into Button's slot-swap morphogram.
   Cursor is prop-keyed only (progress while loading, not-allowed when
   held down): the DOM attr derives from disabled || loading, so any
   `disabled:cursor-*` variant would out-bind it (higher specificity) and
   turn every loading state not-allowed. */

export type ButtonIcon = 'arrow-up-right' | 'brand-github';

const ICONS: Record<ButtonIcon, FC<{ size?: number }>> = {
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

/* No `disabled:cursor-*` — see the header note. */
const STATES = 'disabled:scale-100';

const SHAPE: Record<'md' | 'lg' | 'flush' | 'icon-md' | 'icon-lg', string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  /* Flush pad: the contact send row's Cancel mass (h-12, inset x) — the
     send row's own sizing on this system's language. */
  flush: 'h-12 px-4 text-base',
  /* Icon-only squares: pad swaps out for a fixed square around the glyph. */
  'icon-md': 'size-10',
  'icon-lg': 'size-12',
};

export interface ButtonFrameProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-busy' | 'className' | 'disabled'> {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg' | 'flush' | 'icon-md' | 'icon-lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

/* The frame: everything about the button root — tokens, press snap, the
   cursor choreography, aria-busy, the disabled={disabled || loading}
   click-block — with content left to callers. Cursor precedence is
   explicit: loading wins, so a button that is both loading and disabled
   reads progress at full opacity (a visible loader + the held-down dim
   would fight); the dimmed not-allowed look is reserved for
   disabled-only. Button and the contact send composition both ride it;
   className lands last, so a composition can hook its own trigger
   state-class (send-btn) on the root. */
export const ButtonFrame: FC<ButtonFrameProps> = ({
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) => (
  <button
    {...props}
    aria-busy={loading || undefined}
    disabled={disabled || loading}
    className={cx(
      BASE,
      VARIANT[variant],
      SHAPE[size],
      STATES,
      loading ? 'cursor-progress' : disabled ? 'cursor-not-allowed opacity-40' : undefined,
      className,
    )}
  >
    {children}
  </button>
);

/* Loader slot vs canvas — the custom-loader contract: slot = layout truth
   (the icon slot's footprint, in flow, shrink-0), so the button keeps
   measuring its own label line and the SHAPE footprint is authoritative —
   an in-flow oversized box would grow it. canvas = drawing truth,
   absolutely centered on the slot; it may exceed the slot only into the
   button's padding air space (md: ±4px vertical on a 10px pad, lg: same
   on 12px; horizontal into the gap + px pad) — never the flow.
   overflow-hidden never clips that: it cuts at the padding box. */
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

/* Loader: one shared 2.8s timeline, four 4px dots. Each dot carries its
   own (ax, ay) = starting corner and (bx, by) = the next corner clockwise,
   so a single keyframes (button-morph, globals.css) drives the whole
   sequence: rest merged at center → burst to corners → chase one corner
   clockwise while morphing square→circle → collapse to a center circle →
   damped double bounce → ease circle back to square → loop. Takes the
   button's currentColor, so primary reads gold and secondary reads
   label-white. The geometry constants (±5px travel, 5px/3px drops → 3px
   inner margin in the 20px box) are the validated values; the sweep's
   margin A/B parameter died with the prototype. */
const MORPH_CORNERS: Array<[number, number, number, number]> = [
  [-1, -1, 1, -1], // tl → tr
  [1, -1, 1, 1], // tr → br
  [1, 1, -1, 1], // br → bl
  [-1, 1, -1, -1], // bl → tl
];
const MORPH_OFFSET = 5;
const MORPH_DROP1 = 5;
const MORPH_DROP2 = 3;

const morphDotStyle = ([ax, ay, bx, by]: (typeof MORPH_CORNERS)[number]): CSSProperties =>
  ({
    '--ax': `${ax * MORPH_OFFSET}px`,
    '--ay': `${ay * MORPH_OFFSET}px`,
    '--bx': `${bx * MORPH_OFFSET}px`,
    '--by': `${by * MORPH_OFFSET}px`,
    '--drop1': `${MORPH_DROP1}px`,
    '--drop2': `${MORPH_DROP2}px`,
  }) as CSSProperties;

const Morphogram: FC = () => (
  <span aria-hidden="true" className="relative block size-5 shrink-0">
    {MORPH_CORNERS.map((corner) => (
      <span
        key={corner.join(',')}
        className="button-morph-dot absolute top-1/2 left-1/2 -mt-[2px] -ml-[2px] size-1 bg-current"
        style={morphDotStyle(corner)}
      />
    ))}
  </span>
);

/* Unified glyph box: 20px across text rows, icon-only, and the morphogram
   box — equals the md line-height, so no state ever grows the button. */
const GLYPH = 20;

interface ContentProps {
  label: string;
  icon?: ButtonIcon;
  iconPosition?: 'leading' | 'trailing';
  iconOnly?: boolean;
  loading?: boolean;
}

const Content: FC<ContentProps> = ({
  label,
  icon,
  iconPosition = 'trailing',
  iconOnly,
  loading = false,
}) => {
  const Icon = icon ? ICONS[icon] : null;
  if (iconOnly) {
    return icon ? (
      <>
        {loading ? <Morphogram /> : Icon !== null && <Icon size={GLYPH} />}
        <span className="sr-only">{label}</span>
      </>
    ) : (
      label
    );
  }
  return (
    <>
      {/* Loader takes over the icon's own slot — it sits where the icon
          would sit (leading → before text, trailing → after text), so the
          layout never shifts when loading starts. */}
      {iconPosition === 'leading' &&
        (loading ? <Morphogram /> : Icon !== null && <Icon size={GLYPH} />)}
      <span>{label}</span>
      {iconPosition === 'trailing' &&
        (loading ? <Morphogram /> : Icon !== null && <Icon size={GLYPH} aria-hidden="true" />)}
    </>
  );
};

interface BaseProps {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  label: string;
  icon?: ButtonIcon;
  iconPosition?: 'leading' | 'trailing';
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

type AnchorProps = Omit<BaseProps, 'disabled' | 'loading'> &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type NativeProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-busy' | 'className' | 'disabled'>;

export type ButtonProps = AnchorProps | NativeProps;

/** Renders an `<a>` when `href` is set, otherwise a native `<button>`.
    Anchor mode carries the same tokens; loading/disabled don't exist on
    links, so the cursor stays the BASE pointer there. */
export const Button: FC<ButtonProps> = (props) => {
  if ('href' in props) {
    const {
      variant = 'primary',
      size = 'md',
      label,
      icon,
      iconPosition,
      iconOnly,
      className,
      ...rest
    } = props;
    return (
      <a
        {...rest}
        className={cx(
          BASE,
          VARIANT[variant],
          iconOnly ? SHAPE[size === 'lg' ? 'icon-lg' : 'icon-md'] : SHAPE[size],
          className,
        )}
      >
        <Content label={label} icon={icon} iconPosition={iconPosition} iconOnly={iconOnly} />
      </a>
    );
  }
  const {
    variant = 'primary',
    size = 'md',
    label,
    icon,
    iconPosition,
    iconOnly,
    loading,
    disabled,
    className,
    ...rest
  } = props;
  return (
    <ButtonFrame
      variant={variant}
      size={iconOnly ? (size === 'lg' ? 'icon-lg' : 'icon-md') : size}
      loading={loading}
      disabled={disabled}
      className={className}
      {...rest}
    >
      <Content
        label={label}
        icon={icon}
        iconPosition={iconPosition}
        iconOnly={iconOnly}
        loading={loading}
      />
    </ButtonFrame>
  );
};
