'use client';

import {
  type CSSProperties,
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@/app/lib/utils';

const POPOVER_GAP = 8;

function isInsideFixedSubtree(element: HTMLElement | null): boolean {
  let node = element;
  while (node && node !== document.body) {
    if (getComputedStyle(node).position === 'fixed') return true;
    node = node.parentElement;
  }
  return false;
}

/** Shared positioning and dismissal for the language switcher and form selects. */
export function usePopover({
  estimatedHeight = 96,
  matchTriggerWidth = false,
  disabled = false,
} = {}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const anchorFixedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState<CSSProperties | null>(null);
  const open = expanded && !disabled;

  // Clear placement too, so reopening never paints stale coordinates for a frame.
  const closePopover = useCallback(() => {
    setExpanded(false);
    setPosition(null);
  }, []);

  const openPopover = useCallback(() => {
    if (disabled) return;
    anchorFixedRef.current = isInsideFixedSubtree(rootRef.current);
    setExpanded(true);
  }, [disabled]);

  const computePosition = useCallback(() => {
    const root = rootRef.current;
    // A responsive trigger can disappear while its body portal is still mounted.
    if (!root || root.getClientRects().length === 0) {
      closePopover();
      return;
    }
    const rect = root.getBoundingClientRect();
    const height = panelRef.current?.offsetHeight ?? estimatedHeight;
    const onLeftHalf = rect.left + rect.width / 2 < window.innerWidth / 2;
    const upward = window.innerHeight - rect.bottom < height + POPOVER_GAP;
    const { scrollX, scrollY } = window;
    const fixed = anchorFixedRef.current;
    const next: CSSProperties = {
      position: fixed ? 'fixed' : 'absolute',
      ...(matchTriggerWidth ? { width: rect.width } : {}),
      ...(onLeftHalf
        ? { left: rect.left + (fixed ? 0 : scrollX) }
        : { right: window.innerWidth - rect.right - (fixed ? 0 : scrollX) }),
      ...(upward
        ? { bottom: window.innerHeight - rect.top - (fixed ? 0 : scrollY) + POPOVER_GAP }
        : { top: rect.bottom + (fixed ? 0 : scrollY) + POPOVER_GAP }),
    };
    setPosition((previous) =>
      previous &&
      previous.position === next.position &&
      previous.width === next.width &&
      previous.left === next.left &&
      previous.right === next.right &&
      previous.top === next.top &&
      previous.bottom === next.bottom
        ? previous
        : next,
    );
  }, [closePopover, estimatedHeight, matchTriggerWidth]);

  useEffect(() => {
    if (disabled) closePopover();
  }, [disabled, closePopover]);

  useEffect(() => {
    if (!open) return;

    computePosition();
    // Refine the initial height estimate once the portal has mounted.
    const frame = requestAnimationFrame(computePosition);

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        closePopover();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closePopover();
    }
    function handleScroll() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) {
        closePopover();
        return;
      }
      // Fixed topbar anchors stay in viewport coordinates across page scrolls.
      if (!anchorFixedRef.current) computePosition();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    window.addEventListener('resize', computePosition);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', computePosition);
    };
  }, [open, computePosition, closePopover]);

  return { rootRef, panelRef, open, position, openPopover, closePopover };
}

interface PopoverPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'popover' | 'style'> {
  popover: ReturnType<typeof usePopover>;
}

export function PopoverPanel({ popover, className, children, ...props }: PopoverPanelProps) {
  if (!popover.open || !popover.position) return null;

  // Escape ancestors with backdrop-filter so the panel's own frosted blur works.
  return createPortal(
    <div
      {...props}
      ref={popover.panelRef}
      style={popover.position}
      className={cx(
        'bg-background/80 z-50 min-w-[160px] border border-white/15 py-1.5 shadow-[0_24px_42px_rgba(0,0,0,0.4)] backdrop-blur-[21px]',
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  );
}

export function popoverOptionClassName(selected: boolean) {
  return cx(
    'block text-nowrap px-4 py-1.5 font-general text-sm transition-opacity',
    selected ? 'text-gold' : 'opacity-75 hover:opacity-100',
  );
}
