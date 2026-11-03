'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import { IconCaretLeft, IconCaretRight } from '../ui/icons';
import type { VARIANTS, VariantKey } from './variants';

type VariantEntry = (typeof VARIANTS)[number];

interface Props {
  variants: readonly VariantEntry[];
  current: VariantKey;
}

/** Floating bottom bar cycling `?variant=` (arrows + keyboard ←/→). */
export const PrototypeSwitcher: FC<Props> = ({ variants, current }) => {
  const router = useRouter();
  const pathname = usePathname();
  const index = variants.findIndex(({ key }) => key === current);

  const step = useCallback(
    (delta: number) => {
      const next = variants[(index + delta + variants.length) % variants.length];
      router.replace(`${pathname}?variant=${next.key}`, { scroll: false });
    },
    [pathname, index, variants, router],
  );

  /* Arrow keys cycle, unless the focus sits in an editable element. */
  useEffect(() => {
    const editable = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      return (
        el?.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]') !==
        null
      );
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (editable(event.target)) return;
      event.preventDefault();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  return (
    <div className="text-foreground fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/85 py-2 pr-2 pl-3 text-sm shadow-[0_2px_16px_rgba(0,0,0,0.6)] ring-1 ring-white/20 backdrop-blur">
      <span className="cursor-default pr-2 font-semibold tracking-widest text-white/40 uppercase">
        Variant
      </span>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous variant"
        className="focus-visible:outline-gold cursor-pointer rounded-full p-1 transition-colors hover:bg-white/10 focus-visible:outline-2"
      >
        <IconCaretLeft size={18} />
      </button>
      <span className="min-w-52 text-center" aria-live="polite">
        {current} <span className="text-gold font-bold">{variants[index]?.name}</span>
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next variant"
        className="focus-visible:outline-gold cursor-pointer rounded-full p-1 transition-colors hover:bg-white/10 focus-visible:outline-2"
      >
        <IconCaretRight size={18} />
      </button>
    </div>
  );
};
