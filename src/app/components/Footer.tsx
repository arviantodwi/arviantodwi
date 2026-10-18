import type { FC } from 'react';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { LangSwitcher } from './ui/LangSwitcher';
import { Section } from './ui/Section';
import { SocialNav } from './ui/SocialNav';

const LUCAS_LINKEDIN_URL = 'https://www.linkedin.com/in/lucas-brancher/';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

/**
 * Footer skeleton per the Figma Main artboard: aurora ambience backdrop,
 * a 1200px contact panel scaffold, then the footer band — brand column
 * left, link masts right, aligned to the end. Existing content only;
 * empty slots (aurora art, contact panel, in-page links mast) land in a
 * later content pass.
 */
export const Footer: FC<Props> = ({ dict, locale }) => {
  const [before, name, after] = dict.footer.copyright.split(/<\/?link>/);

  return (
    <footer className="relative z-10 mt-auto overflow-hidden bg-neutral-900 font-general text-sm">
      {/* Aurora ambience backdrop slot (Figma: "Golden ambience — neon aurora"). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" />

      {/* Contact scaffold (Figma: 1200px Contact panel — invitation + inquiry form). */}
      <Section as="div" className="pt-16">
        <div className="mx-auto w-full xl:max-w-[1200px]">
          <div className="xl:p-12">{/* Contact panel slot */}</div>
        </div>
      </Section>

      {/* Footer band (Figma: brand column / link masts, space-between, end-aligned). */}
      <Section as="div" className="pt-20 pb-16">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-end md:justify-between md:gap-16 md:text-left">
          {/* Brand column (Figma: logo + copy + language switcher; logo lands later). */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <p className="opacity-60">
              {before}
              <a
                href={LUCAS_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-opacity hover:opacity-80"
              >
                {name ?? 'Lucas Brancher'}
              </a>{' '}
              {after.trim()}
            </p>
            <LangSwitcher locale={locale} />
          </div>

          {/* Link masts (Figma: in-page links mast + social mast; in-page links land later). */}
          <div className="flex items-center gap-16">
            <SocialNav />
          </div>
        </div>
      </Section>
    </footer>
  );
};
