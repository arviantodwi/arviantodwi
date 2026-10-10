'use client';

import { type FC, useEffect } from 'react';

/**
 * Fades portfolio rows as they scroll behind the sticky section heading.
 * Fade start: the row's top edge touching the title's bottom point.
 * Fade end: the row's bottom edge reaching that same point — i.e. the fade
 * spans the row's own height, so opacity walks down incrementally for the
 * whole time the row is partially behind the title (nothing disappears too
 * fast; nothing fades before overlap begins). Measured per frame — the
 * heading travels with the page while pinned.
 * Purely imperative (no state) — one passive scroll listener + rAF.
 */
export const PortfolioItemFade: FC = () => {
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('.portfolio-heading');
    const rows = document.querySelectorAll<HTMLElement>('.portfolio-item');
    if (!heading || rows.length === 0) return;

    let frame = 0;

    function update() {
      frame = 0;
      const headingRect = heading?.getBoundingClientRect();
      if (!headingRect) return;
      const zoneBottom = headingRect.bottom;
      const zoneTop = headingRect.top;
      const viewportHeight = window.innerHeight;

      for (const row of rows) {
        const { top, height } = row.getBoundingClientRect();

        // Fade progress = the row's own height sliding past the heading's
        // bottom point: 0 exactly when the row's top edge touches the title's
        // bottom point, 1 exactly when the row's bottom edge touches that
        // same point (whole row scrolled behind). Linear — steady, no sudden
        // disappear; the full fade duration equals the row's own height.
        const behind = Math.max(0, Math.min(zoneBottom - top, height));
        const exitFactor = 1 - behind / height;

        // Fade back in as the row enters the viewport from below.
        const entryFactor = Math.max(
          0,
          Math.min(1, (viewportHeight - top) / (viewportHeight * 0.25)),
        );

        row.style.opacity = String(Math.min(exitFactor, entryFactor));
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
};
