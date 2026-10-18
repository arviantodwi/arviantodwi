import type { ElementType, FC, ReactNode } from 'react';
import { cx } from '@/app/lib/utils';

/**
 * Shared section shell per the Figma 1440 artboard (docs/design.md):
 * fluid gutters on small screens, capped centered column on md/lg,
 * then the 1440 shell with 120px gutters at xl. `as` renders a
 * different tag (e.g. div) when a section needs an inner container
 * rather than a landmark. Per-section overrides pass through
 * `className` (cx resolves conflicting tiers via tailwind-merge).
 */
const BASE = 'relative z-10 px-6 md:mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-[1440px] xl:px-30';

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

export const Section: FC<Props> = ({ as: Tag = 'section', className, children }) => (
  <Tag className={cx(BASE, className)}>{children}</Tag>
);
