'use client';

import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NEXT_LOCALE_COOKIE } from '@/app/lib/constants';
import type { Locale } from '@/app/lib/i18n/types';
import { cx } from '@/app/lib/utils';
import { IconLanguage, IconSelector } from './icons';

const OPTIONS: { locale: Locale; href: string; label: string }[] = [
  { locale: 'en', href: '/', label: 'English' },
  { locale: 'id', href: '/id', label: 'Bahasa Indonesia' },
];

interface Props {
  locale: Locale;
  className?: string;
}

function persistLocale(locale: Locale) {
  document.cookie = `${NEXT_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

function isInsideFixedSubtree(el: HTMLElement | null): boolean {
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    if (getComputedStyle(node).position === 'fixed') return true;
    node = node.parentElement;
  }
  return false;
}

/** Rough height of the popover panel (2 items + padding + border) before it mounts. */
const POPOVER_HEIGHT = 96;
const POPOVER_GAP = 8;

interface PopPos {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export const LangSwitcher: FC<Props> = ({ locale, className }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PopPos | null>(null);
  // Whether the trigger lives in a position:fixed subtree (topbar) — the panel
  // is then viewport-fixed and never repositioned; otherwise (footer) it is
  // document-anchored and flips only when placement nears a viewport edge.
  const anchorFixedRef = useRef(false);

  // The popover is portaled to <body>: both usages (fixed topbar, footer band)
  // live inside an ancestor with backdrop-filter, which forms a backdrop-root
  // boundary — a nested backdrop-filter can't sample content painted beyond it,
  // so the frosted effect silently died. Escaping to <body> restores the blur.
  const computePos = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const height = popRef.current?.offsetHeight ?? POPOVER_HEIGHT;
    // Anchor to the nearer side: footer's switcher sits on the left of the
    // viewport (left-anchored), the topbar's on the right (right-anchored).
    const onLeftHalf = rect.left + rect.width / 2 < window.innerWidth / 2;
    // Flip when the current placement would run too close to a viewport edge.
    const upward = window.innerHeight - rect.bottom < height + POPOVER_GAP;
    const { scrollX, scrollY } = window;
    setPos((prev) => {
      const next: PopPos = anchorFixedRef.current
        ? {
            // Viewport coords for a fixed anchor — constant across scroll, so
            // the panel never drifts with the topbar.
            ...(onLeftHalf ? { left: rect.left } : { right: window.innerWidth - rect.right }),
            ...(upward
              ? { bottom: window.innerHeight - rect.top + POPOVER_GAP }
              : { top: rect.bottom + POPOVER_GAP }),
          }
        : {
            // Document coords — the panel scrolls naturally with the page,
            // glued to its trigger button.
            ...(onLeftHalf
              ? { left: rect.left + scrollX }
              : { right: window.innerWidth - rect.right - scrollX }),
            ...(upward
              ? { bottom: window.innerHeight - scrollY - rect.top + POPOVER_GAP }
              : { top: scrollY + rect.bottom + POPOVER_GAP }),
          };
      if (
        prev &&
        prev.left === next.left &&
        prev.right === next.right &&
        prev.top === next.top &&
        prev.bottom === next.bottom
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  // Single close path: also clears the placement so a later reopen can't paint
  // the portal with the previous session's (possibly flipped) coordinates —
  // the stale value otherwise shows for one frame before computePos corrects it.
  const closePopover = useCallback(() => {
    setOpen(false);
    setPos(null);
  }, []);

  function handleToggle() {
    if (open) {
      closePopover();
      return;
    }
    anchorFixedRef.current = isInsideFixedSubtree(rootRef.current);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    computePos();
    // Re-run once mounted: the panel's real height refines the flip decision
    // (the first pass estimated from POPOVER_HEIGHT).
    requestAnimationFrame(computePos);

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !popRef.current?.contains(target)) {
        closePopover();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closePopover();
    }

    function handleScroll() {
      // A fixed anchor never moves relative to the viewport — nothing to do.
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) {
        closePopover();
        return;
      }
      if (!anchorFixedRef.current) computePos();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    window.addEventListener('resize', computePos);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', computePos);
    };
  }, [open, computePos, closePopover]);

  return (
    <div ref={rootRef} className={cx('relative self-start', className)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Language"
        onClick={handleToggle}
        className="font-general flex cursor-pointer items-center gap-1.5 text-sm text-white"
      >
        <IconLanguage size={18} />
        {locale.toUpperCase()}
        <IconSelector size={14} className="opacity-60" />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={popRef}
            style={{ top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right }}
            className={cx(
              'bg-background/80 z-50 min-w-[160px] border border-white/15 py-1.5 shadow-[0_24px_42px_rgba(0,0,0,0.4)] backdrop-blur-[21px]',
              // Viewport-fixed for a fixed anchor (topbar), document-anchored otherwise (footer).
              anchorFixedRef.current ? 'fixed' : 'absolute',
            )}
          >
            <ul>
              {OPTIONS.map(({ href, label, locale: optionLocale }) => (
                <li key={optionLocale}>
                  {/* Full navigation so the locale-persisting request flows through the proxy. */}
                  <a
                    href={href}
                    aria-current={optionLocale === locale ? 'true' : undefined}
                    onClick={() => {
                      persistLocale(optionLocale);
                      setOpen(false);
                    }}
                    className={cx(
                      'block text-nowrap px-4 py-1.5 font-general text-sm transition-opacity',
                      optionLocale === locale ? 'text-gold' : 'opacity-75 hover:opacity-100',
                    )}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};
