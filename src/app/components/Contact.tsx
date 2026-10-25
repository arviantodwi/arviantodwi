import type { FC } from 'react';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { ContactForm } from './ContactForm';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

/**
 * Contact panel per the .pen "Contact — Precision Panel" frame (node on10I):
 * glass panel over the page base with three gold ambient glows (the design's
 * pulses are disabled in the pen file), an invitation header (36px
 * Plus Jakarta Sans heading + gold brand rule on the same row), then the
 * project inquiry row rendered by the `ContactForm` client island —
 * interest selector left, hairline divider, form right. Mobile collapses to
 * a single column (divider hidden).
 */
export const Contact: FC<Props> = ({ dict, locale }) => {
  return (
    <div className="relative overflow-hidden rounded-none border border-white/15 bg-background/80 shadow-[0_24px_42px_rgba(0,0,0,0.4)] backdrop-blur-[21px]">
      {/* Ambient glows (design: gold ellipses at top-left 320/12%, top-right
          280/10%, bottom-right 240/8%, blur 70/63/56, clipped by the panel).
          Decorative only — must never intercept clicks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[80px] -left-[120px] h-80 w-80 rounded-full bg-gold opacity-[0.12] blur-[70px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[60px] -right-[96px] h-70 w-70 rounded-full bg-gold opacity-[0.1] blur-[63px]"
      />
      {/* Bottom-right glow: anchored to the container's bottom edge (hangs
          below it, clipped) — follows any height change of the panel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-9 -bottom-10 h-60 w-60 rounded-full bg-gold opacity-[0.08] blur-[56px]"
      />

      {/* Invitation header: 36px heading is Plus Jakarta Sans in the design
          (font-general, deliberately NOT font-headline); the gold brand rule
          fills the remaining row width to the panel's right edge. */}
      <div className="relative flex flex-col gap-8 border-white/15 border-b p-8 md:px-12 md:py-10">
        <div className="flex items-center gap-6">
          <h2 className="font-bold font-general text-4xl text-white tracking-[-0.01em]">
            {dict.contact.heading}
          </h2>
          {/* Gold rule: hidden on small screens — the wrapped heading leaves
              it zero width. */}
          <div aria-hidden="true" className="hidden h-[3px] flex-1 bg-gold md:block" />
        </div>
      </div>

      <ContactForm dict={dict} locale={locale} />
    </div>
  );
};
