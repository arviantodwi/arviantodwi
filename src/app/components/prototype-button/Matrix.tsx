import type { FC, ReactNode } from 'react';
import { cx } from '@/app/lib/utils';
import { IconArrowUpRight, IconBrandGithub } from '../ui/icons';

/* PROTOTYPE (button spec) — comparison harness. Every variant mounts its
   own <Button> into the same matrix; the harness holds no styling.
   Slot sizes, unified: text-row + icon-only glyphs render at 20px, and
   Variant D's morphogram drives its 20px box — no in-growth, no shift.
   Bigger drawing room is a custom-loader-only privilege (LoaderSlot's
   slot/canvas pair; contact send exhibit). */

export type ProtoIcon = 'arrow-up-right' | 'brand-github';

export interface ProtoButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  label: string;
  icon?: ProtoIcon;
  iconPosition?: 'leading' | 'trailing';
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  loaderMargin?: 2 | 3;
}

type ProtoButton = FC<ProtoButtonProps>;

const _ICONS: Record<ProtoIcon, FC<{ size?: number }>> = {
  'arrow-up-right': IconArrowUpRight,
  'brand-github': IconBrandGithub,
};

/** Shared loading glyph — an arc ring on Tailwind's built-in spin. */
export const ProtoSpinner: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={cx('size-4 animate-spin', className)}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const KINDS: ProtoButtonProps[] = [
  { label: 'Download CV' },
  { label: 'Follow', icon: 'brand-github', iconPosition: 'leading' },
  { label: 'Download CV', icon: 'arrow-up-right', iconPosition: 'trailing' },
  { label: 'Open', icon: 'arrow-up-right', iconOnly: true },
];

const StateRow: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <div className="flex flex-wrap items-center gap-4">
    <span className="w-24 shrink-0 text-xs font-medium tracking-widest text-white/40 uppercase">
      {title}
    </span>
    {children}
  </div>
);

const KindRow: FC<{
  title: string;
  variant: 'primary' | 'secondary';
  button: ProtoButton;
  loading?: boolean;
  disabled?: boolean;
  loaderMargin?: 2 | 3;
}> = ({ title, variant, button: Button, loading = false, disabled = false, loaderMargin }) => (
  <StateRow title={title}>
    {KINDS.map((kind) => (
      <Button
        key={`${kind.label}-${kind.icon ?? 'none'}-${loaderMargin ?? ''}`}
        {...kind}
        variant={variant}
        loading={loading}
        disabled={disabled}
        loaderMargin={loaderMargin}
      />
    ))}
  </StateRow>
);

const Group: FC<{
  title: string;
  variant: 'primary' | 'secondary';
  button: ProtoButton;
  abTestLoaderMargin?: boolean;
}> = ({ title, variant, button: Button, abTestLoaderMargin }) => (
  <section className="flex flex-col gap-4">
    <h3 className="text-gold text-sm tracking-widest uppercase">{title}</h3>
    {/* Default/loading/disabled all carry the group's variant, so they read
        exactly like the this-group size strip below — true secondary on the
        Secondary group only, never a primary-styled stand-in. */}
    <KindRow title="Default" variant={variant} button={Button} />
    {abTestLoaderMargin ? (
      <>
        <KindRow title="Loading 3px" variant={variant} button={Button} loading loaderMargin={3} />
        <KindRow title="Loading 2px" variant={variant} button={Button} loading loaderMargin={2} />
      </>
    ) : (
      <KindRow title="Loading" variant={variant} button={Button} loading />
    )}
    <KindRow title="Disabled" variant={variant} button={Button} disabled />
    <StateRow title="Sizes">
      <Button variant={variant} label="MD" />
      <Button variant={variant} label="LG" size="lg" />
      <Button variant={variant} label="Open" icon="arrow-up-right" iconOnly />
      <Button variant={variant} label="Open" icon="arrow-up-right" iconOnly size="lg" />
    </StateRow>
  </section>
);

export const Matrix: FC<{ button: ProtoButton; abTestLoaderMargin?: boolean }> = ({
  button: Button,
  abTestLoaderMargin,
}) => (
  <div className="flex flex-col gap-16">
    <Group
      title="Primary"
      variant="primary"
      button={Button}
      abTestLoaderMargin={abTestLoaderMargin}
    />
    <Group
      title="Secondary"
      variant="secondary"
      button={Button}
      abTestLoaderMargin={abTestLoaderMargin}
    />
  </div>
);
