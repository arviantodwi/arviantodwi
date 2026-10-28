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
  // content sections carry their own z-layers above the circle. The ≥xl
  // aurora/background pair therefore anchors to the positioned band
  // wrapper, NOT to the footer root.
  return (
    <footer className="bg-background font-general mt-auto overflow-hidden text-sm">
      {/* Contact scaffold (pen: 1200px Contact content — invitation + inquiry form).
          z-20 keeps the panel above the decoration pair. From xl the design
          gives the contact content an 80px top pad and NO bottom pad — the
          band follows flush, so the old negative-margin construction (kept
          below xl until the sub-xl pass) is dropped. */}
      <Section as="div" id="contact" className="relative z-20 pt-16 xl:pt-0">
        <div className="mx-auto w-full xl:max-w-[1200px]">
          <div className="mb-[-216px] xl:mb-0 xl:px-12 xl:pt-20 xl:pb-0">
            <Contact dict={dict} locale={locale} />
          </div>
        </div>
      </Section>

      {/* Footer band (pen node x2r6j / y5lpN: glass root; pad 48/120 around the
          band, band pad 40/0). From xl the glass fill moved onto the root-level
          GcP61 layer above, so this section goes transparent there and its top
          padding becomes the design's 48px (the 220px clear-out + 64px pad are
          below-xl legacy). */}
      <div className="relative z-10">
        {/* ≥xl decoration pair (pen nodes aIybe + GcP61), anchored to the band
            wrapper so aurora and background move as ONE unit and can never
            separate: the aurora strip's bottom edge keys the background's top
            edge (flex column — the strip is 231px, the background flex-1).
            Pen geometry: the background's top line sits 164px above the band
            edge (GcP61 y=512 over a 676px contact section), which puts the
            aurora's bright core (55% down its natural art) ~47px below the
            line — behind the panel's lower half, dimmed by the background.
            z-0 under the glass div (z-1 above it) keeps band text readable
            while the background's blur samples the aurora's overflowing
            tail. The art draws at natural aspect (513px tall at 1440):
            everything past its 231px box overflows downward — the pair never
            scales it to fit. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-[395px] bottom-0 z-0 hidden flex-col xl:flex"
        >
          {/* Golden ambience — neon aurora (aIybe): natural 1886×672 asset,
              exported @2x from the .pen with its 0.6 opacity and blur bleed
              baked in, at full design width. */}
          <div aria-hidden="true" className="relative h-[231px] shrink-0">
            <Image
              src="/footer-aurora.png"
              width={1886}
              height={672}
              alt=""
              className="h-auto w-full"
            />
          </div>
          {/* GcP61 — the absolute background: 40%-black ground + hairline top
              border + glass blur, filling from the aurora strip's bottom edge
              to the wrapper's bottom edge (= the footer's, no footer padding).
              Sibling — not parent — of the aurora so the blur reads what the
              design draws through the glass. `relative` puts it later in the
              positioned paint order than the strip, so the aurora's natural
              overflow tail dim under it instead of shining over it. */}
          <div
            aria-hidden="true"
            className="bg-background/40 flex-1 relative border-t border-white/15 backdrop-blur-md"
          />
        </div>
        {/* Neon aurora for the ≤xl construction (pen: art hanging behind the
            contact section, bright core at the band's top edge). Replaced above
            xl by the pair above. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[69%] z-0 aspect-[1886/672] w-full xl:hidden"
        >
          <Image
            src="/footer-aurora.png"
            width={1886}
            height={672}
            alt=""
            className="-mb-[212px] h-full w-full object-cover"
          />
        </div>
        <div className="bg-background/40 xl:backdrop-blur-0 relative z-1 border-t border-white/15 backdrop-blur-md xl:border-transparent xl:bg-transparent">
          {/* Crystal layer: the background fill/border/blur live on the ≥xl
              decoration pair above; ≤xl this div IS the glass, and at xl it
              goes fully transparent. The z-1 keeps the band content above the
              z-0 pair at xl (paint order: positioned siblings win over this
              div's old flow paint). */}

          <Section as="div" className="pt-[220px] pb-16 xl:pt-12 xl:pb-12">
            <div className="relative flex flex-col gap-7 py-14 min-[600px]:max-lg:gap-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16 xl:py-10">
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
