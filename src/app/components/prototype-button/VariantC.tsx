import type { FC } from 'react';
import { cx } from '@/app/lib/utils';
import { IconArrowUpRight, IconBrandGithub } from '../ui/icons';
import { Matrix, type ProtoButtonProps, type ProtoIcon, ProtoSpinner } from './Matrix';

/* PROTOTYPE (button spec) — Variant C: frost glass, the topbar/popover
   idiom (rounded, translucent fill + hairline border). Primary = gold-tinted
   glass, secondary = neutral glass. Hover brightens fill + border; click
   presses with an inner dim; loading adds a shimmer sweep. */

const PROTO_ICONS: Record<ProtoIcon, FC<{ size?: number }>> = {
  'arrow-up-right': IconArrowUpRight,
  'brand-github': IconBrandGithub,
};

const BASE =
  'relative inline-flex overflow-hidden items-center justify-center gap-2 rounded-md border backdrop-blur-sm font-general font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const VARIANT: Record<'primary' | 'secondary', string> = {
  primary:
    'border-gold/50 bg-gold/15 text-gold hover:border-gold hover:bg-gold/25 active:scale-[0.98] active:bg-gold/10',
  secondary:
    'border-white/15 bg-white/[0.08] text-foreground hover:border-white/50 hover:bg-white/[0.16] active:scale-[0.98] active:bg-white/[0.06]',
};

const STATES = 'disabled:cursor-not-allowed disabled:opacity-40 disabled:scale-100';

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
    STATES,
    disabled && 'cursor-not-allowed',
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
        iconPosition === 'leading' && Icon !== null && <Icon size={18} />
      )}
      <span>{label}</span>
      {iconPosition === 'trailing' && Icon !== null && <Icon size={18} aria-hidden="true" />}
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
      {loading && (
        <span aria-hidden="true" className="proto-shimmer pointer-events-none absolute inset-0" />
      )}
    </button>
  );
};

export const VariantC = () => <Matrix button={Button} />;
