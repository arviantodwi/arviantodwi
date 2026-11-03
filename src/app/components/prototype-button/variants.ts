/**
 * PROTOTYPE (button spec, 2026-11-04) — throwaway; lives on a prototype
 * branch, not main. Switchable via `?variant=` on /<lang>/prototype-button.
 * Three structurally different button design systems rendering the same
 * spec matrix: primary/secondary × (text, leading icon, trailing icon,
 * icon-only) × (default, loading, disabled) with live hover/active.
 */
export const VARIANTS = [
  { key: 'A', name: 'Neo-brutal press' },
  { key: 'B', name: 'Flat gold' },
  { key: 'C', name: 'Frost glass' },
  { key: 'D', name: 'Sharp glass' },
] as const;

export type VariantKey = (typeof VARIANTS)[number]['key'];

export const hasVariantKey = (value: string): value is VariantKey =>
  VARIANTS.some(({ key }) => key === value);
