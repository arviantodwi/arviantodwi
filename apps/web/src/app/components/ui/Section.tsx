import type { ElementType, FC, ReactNode } from 'react';
import { cx } from '@/app/lib/utils';

/**
 * Shared section shell per the .pen responsive group (docs/design.md),
 * per the owner's static-container rule (2026-11-01): fluid only at
 * uSM/SM (inline gutters 24/32); from md every tier is a FIXED container
 * centered with margins that absorb viewport growth, never the content:
 * 672px content at md (48px gutters), 896px at lg (64), 1200px at xl (120
 * at the 1440 viewport). Pen numbers: @MD section x48/w672 in a 768
 * artboard, @LG x64/w896 in 1024, @XL 1200px content in 1440. The md
 * exception: the TechStack marquee stays viewport-fluid
 * (`mx-[calc(50%_-_50vw)]`).
 * `as` renders a different tag (e.g. div) when a section needs an inner
 * container rather than a landmark. Per-section overrides pass through
 * `className` (cx resolves conflicting tiers via tailwind-merge).
 */
const BASE =
  'relative z-10 w-full px-6 sm:px-8 md:mx-auto md:max-w-[768px] md:px-12 lg:mx-auto lg:max-w-[1024px] lg:px-16 xl:mx-auto xl:max-w-[1200px] xl:px-0';

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
}

export const Section: FC<Props> = ({ as: Tag = 'section', className, children, id }) => (
  <Tag className={cx(BASE, className)} id={id}>
    {children}
  </Tag>
);
