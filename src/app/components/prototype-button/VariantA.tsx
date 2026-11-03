import type { FC } from 'react';
import { cx } from '@/app/lib/utils';
import { IconArrowUpRight, IconBrandGithub } from '../ui/icons';
import { Matrix, type ProtoButtonProps, type ProtoIcon, ProtoSpinner } from './Matrix';

/* PROTOTYPE (button spec) — Variant A: neo-brutal evolved.
   Keeps the shipped idiom (sharp corners, 2px black border, offset hard
   shadow) and completes its state language: hover = press in one step,
   click = full press (shadow collapses), loading = spinner in the icon
   slot while held down, disabled = flat + dimmed. */

const PROTO_ICONS: Record<ProtoIcon, FC<{ size?: number }>> = {
  'arrow-up-right': IconArrowUpRight,
  'brand-github': IconBrandGithub,
};

const BASE =
  'inline-flex items-center justify-center gap-2 border-2 border-black font-general font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const VARIANT: Record<'primary' | 'secondary', string> = {
  primary: 'bg-gold text-background',
  secondary: 'text-foreground',
};

const STATES =
  'disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none disabled:opacity-50';

const SHAPE: Record<NonNullable<ProtoButtonProps['size']>, string> = {
  md: 'px-4 py-2 text-sm shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
  lg: 'px-6 py-3 text-base shadow-[6px_6px_0_0_black] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_0_black] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none',
};

const ICON_ONLY: Record<'md' | 'lg', string> = { md: 'size-10 p-2', lg: 'size-12 p-3' };

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
  const classes = cx(
    BASE,
    VARIANT[variant],
    iconOnly ? ICON_ONLY[size] : SHAPE[size],
    STATES,
    disabled && 'cursor-not-allowed',
  );
  return (
    <button
      type="button"
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={classes}
    >
      {(() => {
        if (iconOnly && icon) {
          const Glyph = PROTO_ICONS[icon];
          return (
            <span className="inline-flex items-center justify-center">
              {loading ? <ProtoSpinner /> : <Glyph size={18} />}
              <span className="sr-only">{label}</span>
            </span>
          );
        }
        const Icon = icon ? PROTO_ICONS[icon] : null;
        return (
          <>
            {loading && <ProtoSpinner />}
            {!loading && iconPosition === 'leading' && icon && Icon !== null && <Icon size={18} />}
            <span>{label}</span>
            {!loading && iconPosition === 'trailing' && icon && Icon !== null && (
              <Icon size={18} aria-hidden="true" />
            )}
          </>
        );
      })()}
    </button>
  );
};

export const VariantA = () => <Matrix button={Button} />;
