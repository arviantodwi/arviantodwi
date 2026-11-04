import type { FC } from 'react';
import { cx } from '@/app/lib/utils';
import { IconArrowUpRight, IconBrandGithub } from '../ui/icons';
import { Matrix, type ProtoButtonProps, type ProtoIcon, ProtoSpinner } from './Matrix';

/* PROTOTYPE (button spec) — Variant B: flat gold, the contact frame's idiom
   (no border, no offset shadow — .pen send button). Lifts on hover, scales
   down on click; secondary = the Cancel trigger's hairline outline. */

const PROTO_ICONS: Record<ProtoIcon, FC<{ size?: number }>> = {
  'arrow-up-right': IconArrowUpRight,
  'brand-github': IconBrandGithub,
};

const BASE =
  'inline-flex items-center justify-center gap-2 font-general font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const VARIANT: Record<'primary' | 'secondary', string> = {
  primary: 'bg-gold text-background',
  secondary:
    'border border-foreground/60 text-foreground/70 hover:border-foreground hover:text-foreground',
};

const MOTION = 'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96]';

/* No `disabled:cursor-*` — cursor is prop-keyed (mirrors VariantD's frame);
   the DOM attr derives from disabled || loading, so a variant selector
   would out-bind cursor-progress on the pinned loading rows. */
const STATES =
  'disabled:translate-y-0 disabled:scale-100 disabled:opacity-45 disabled:hover:translate-y-0 disabled:border-foreground/60';

const SHAPE: Record<'md' | 'lg', string> = { md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
const ICON_ONLY = { md: 'size-10', lg: 'size-12' };

const Button: FC<ProtoButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  icon,
  iconPosition = 'trailing',
  iconOnly,
  loading,
  disabled,
}) => {
  const Icon = icon ? PROTO_ICONS[icon] : null;
  const classes = cx(
    BASE,
    VARIANT[variant],
    iconOnly ? ICON_ONLY[size] : SHAPE[size],
    !disabled && !loading && MOTION,
    STATES,
    /* cursor-progress while the custom loader drives the button, so a
       mouse waits even though the disabled click-block (disabled={loading})
       reads cursor-not-allowed only on the disabled prop. Mirrors D. */
    disabled ? 'cursor-not-allowed' : loading && 'cursor-progress',
  );

  const content = iconOnly ? (
    icon ? (
      <>
        {loading ? <ProtoSpinner /> : Icon !== null && <Icon size={20} />}
        <span className="sr-only">{label}</span>
      </>
    ) : (
      label
    )
  ) : (
    <>
      {loading ? (
        <ProtoSpinner />
      ) : (
        iconPosition === 'leading' && Icon !== null && <Icon size={20} />
      )}
      <span>{label}</span>
      {iconPosition === 'trailing' && Icon !== null && <Icon size={20} aria-hidden="true" />}
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

export const VariantB = () => <Matrix button={Button} />;
