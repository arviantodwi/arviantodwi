import Image from 'next/image';
import type { FC } from 'react';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { CV_URL, GITHUB_URL, LINKEDIN_URL } from '../lib/constants';
import { Contact } from './Contact';
import { IconArrowUpRight } from './ui/icons';
import { LangSwitcher } from './ui/LangSwitcher';
import { Section } from './ui/Section';

const LUCAS_LINKEDIN_URL = 'https://www.linkedin.com/in/lucas-brancher/';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

/**
 * Footer per the .pen Footer frame (node lze4B): the neon aurora art sits at
 * the footer root BEHIND both content sections — the contact panel (z-20)
 * and the glass band (z-10, backdrop-blur reads the aurora through the
 * glass). Band content: brand column left, two link masts right,
 * end-aligned; masts are hairline-separated rows — up-right arrow on
 * external links only, gold 11px mast labels.
 */
export const Footer: FC<Props> = ({ dict, locale }) => {
  const [before, name, after] = dict.footer.copyright.split(/<\/?link>/);
  const { mast } = dict.footer;

  const inPageLinks = [
    { label: mast.links.about, href: '#about' },
    { label: mast.links.cv, href: CV_URL, external: true },
    { label: mast.links.humanAi, href: '#human-ai' },
    { label: mast.links.portfolio, href: '#portfolio' },
    { label: mast.links.testimonials, href: '#testimonials' },
    { label: mast.links.message, href: '#contact' },
  ];
  const socialLinks = [
    { label: mast.socialLinks.github, href: GITHUB_URL, external: true },
    { label: mast.socialLinks.linkedin, href: LINKEDIN_URL, external: true },
  ];

  const mastRow = (link: { label: string; href: string; external?: boolean }) => (
    <div key={link.href + link.label}>
      <a
        href={link.href}
        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="flex h-[37px] items-center justify-between text-base font-semibold text-white/75 transition-colors hover:text-white"
      >
        {link.label}
        {link.external && <IconArrowUpRight size={16} aria-hidden="true" />}
      </a>
      <div aria-hidden="true" className="h-px bg-white/10" />
    </div>
  );

  // Footer root paints BELOW main's fixed blurred-circle accent (no
  // positioning/z-index here — a positioned root lands in the same paint
  // layer as the z-0 pseudo but later in DOM order, so its opaque bg
  // covers the glow and clips it at the footer's top edge). The two
  // content sections carry their own z-layers above the circle.
  return (
    <footer className="bg-background font-general mt-auto overflow-hidden text-sm">
      {/* Footer root sits straight on the #040404 page base (no fill in the
          design); the glass treatment lives on the band section below. */}
      {/* Aurora ambience backdrop slot (Figma: "Golden ambience — neon aurora"). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" />

      {/* Contact scaffold (Figma: 1200px Contact panel — invitation + inquiry form).
          z-20 keeps the panel above the band's aurora overhang (design: aurora
          paints behind BOTH footer content sections). */}
      <Section as="div" id="contact" className="relative z-20 pt-16">
        <div className="mx-auto w-full xl:max-w-[1200px]">
          {/* Negative bottom margin tucks the band (and its aurora overhang)
              up behind the panel's lower edge — the aurora's bright core sits
              at the panel bottom, per the design. */}
          <div className="mb-[-216px] xl:px-12 xl:py-16">
            <Contact dict={dict} locale={locale} />
          </div>
        </div>
      </Section>

      {/* Footer band (Figma node x2r6j: glass root — bg 40% + backdrop blur over
          the aurora; pad 220/64 around the py-56 band). The z-10 wrapper holds
          the aurora BELOW the band glass (its backdrop-blur reads it) and below
          the contact section above. */}
      <div className="relative z-10">
        {/* Neon aurora glow hugging the band's top edge (design: 1886×672 art
            at its natural aspect — `cover` fills the full width without
            distortion or clipping since the container matches the art ratio;
            bottom-full hangs it behind the contact section, per the .pen
            footer root where the art ends at the band's top edge). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[69%] z-0 aspect-[1886/672] w-full"
        >
          <Image
            src="/footer-aurora.png"
            width={1886}
            height={672}
            alt=""
            className="-mb-[212px] h-full w-full object-cover"
          />
        </div>
        <div className="bg-background/40 border-t border-white/15 backdrop-blur-md">
          {/* Clear the 216px contact overlap at every viewport width. */}
          <Section as="div" className="pt-[220px] pb-16">
            <div className="relative flex flex-col gap-7 py-14 min-[600px]:max-lg:gap-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              {/* Brand column (design: 274×64 white wordmark, copy, language switcher). */}
              <div className="flex max-w-[550px] flex-col gap-3">
                {/* Design (.pen Footer brand): 274×64 white wordmark, scaled
                    proportionally to fit narrow columns. */}
                <Image
                  src="/logo.svg"
                  width={274}
                  height={64}
                  alt="logo"
                  className="h-auto w-[274px] max-w-full self-start"
                />
                <p className="text-base font-medium text-white/75">
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

              {/* Equal columns from 600px until lg; desktop keeps 200px link masts. */}
              <div className="flex flex-col gap-7 min-[600px]:max-lg:grid min-[600px]:max-lg:grid-cols-2 min-[600px]:max-lg:gap-8 lg:flex-row lg:gap-16">
                <nav
                  aria-label={mast.inPage}
                  className="flex w-[200px] shrink-0 flex-col gap-3 pt-[22px] min-[600px]:max-lg:w-full"
                >
                  <p className="text-gold text-[11px] font-bold tracking-[2.4px] uppercase">
                    {mast.inPage}
                  </p>
                  <div className="flex flex-col">{inPageLinks.map(mastRow)}</div>
                </nav>
                <nav
                  aria-label={mast.social}
                  className="flex w-[200px] shrink-0 flex-col gap-3 pt-[22px] min-[600px]:max-lg:w-full"
                >
                  <p className="text-gold text-[11px] font-bold tracking-[2.4px] uppercase">
                    {mast.social}
                  </p>
                  <div className="flex flex-col">{socialLinks.map(mastRow)}</div>
                </nav>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </footer>
  );
};
