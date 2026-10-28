import type { FC } from 'react';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { ContactForm } from './ContactForm';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

/**
 * Contact panel per the .pen "Contact panel" component (node gQvrX, updated
 * design reduced to TWO gold ambient glows — bottom-right removed): glass
 * panel over the page base with an invitation header (36px Plus Jakarta Sans
 * heading + gold brand rule on the same row), then the project inquiry row
 * rendered by the `ContactForm` client island — interest selector left,
 * hairline divider, form right. Mobile collapses to a single column
 * (divider hidden).
 */
export const Contact: FC<Props> = ({ dict, locale }) => {
  return (
    <div className="bg-background/80 relative overflow-hidden rounded-none border border-white/15 shadow-[0_24px_42px_rgba(0,0,0,0.4)] backdrop-blur-[21px]">
      {/* Ambient glows (design: gold ellipses — top-left 320 at −120,−80/12%,
          top-right 280 at 850,−180/10% — the updated design pulls the
          top-right glow further up: it renders as a bleed past the panel's
          top edge). Decorative only — must never intercept clicks. */}
      <div
        aria-hidden="true"
        className="bg-gold pointer-events-none absolute -top-[80px] -left-[120px] h-80 w-80 rounded-full opacity-[0.12] blur-[70px]"
      />
      <div
        aria-hidden="true"
        className="bg-gold pointer-events-none absolute -top-[180px] -right-[26px] h-70 w-70 rounded-full opacity-[0.1] blur-[63px]"
      />

      {/* Invitation header: 36px heading is Plus Jakarta Sans in the design
          (font-general, deliberately NOT font-headline); the gold brand rule
          fills the remaining row width to the panel's right edge. */}
      <div className="relative flex flex-col gap-8 border-b border-white/15 p-8 md:px-12 md:py-10">
        <div className="flex items-center gap-6">
          <h2 className="font-general text-4xl font-bold tracking-[-0.01em] text-white">
            {dict.contact.heading}
          </h2>
          {/* Gold rule: hidden on small screens — the wrapped heading leaves
              it zero width. */}
          <div aria-hidden="true" className="bg-gold hidden h-[3px] flex-1 md:block" />
        </div>
      </div>

      <ContactForm dict={dict} locale={locale} />
    </div>
  );
};
