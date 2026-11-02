'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  children: ReactNode;
  /** Static stand-in rendered (server-side) until the child is ready. */
  fallback: ReactNode;
  /**
   * IntersectionObserver root margin — hydrate when close enough that the
   * swap stays invisible. `rootMargin` bottom is the pre-render lead.
   */
  rootMargin?: string;
  className?: string;
}

/**
 * Defers hydrating heavy, below-the-fold client components (Swiper carousel)
 * until the section nears the viewport. Keeps first paint / SEO static, and
 * removes the hydration work from page load on weak devices — the 2026-11-02
 * iPhone 11 Pro load fix.
 */
export function HydrateInView({ children, fallback, rootMargin = '300px', className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {ready ? children : fallback}
    </div>
  );
}
