import Image from 'next/image';
import type { FC } from 'react';
import type { Locale } from '@/app/libs/i18n/types';
import { PortfolioItemFade } from './ui/PortfolioItemFade';

interface Props {
  locale: Locale;
}

/**
 * Project entries are proper nouns, kept identical across locales.
 * Titles are one word per line (mirrors the Figma 3-line title block) with a
 * per-line opacity ramp (75% → 85% → 100%).
 * Images are flattened exports of the Figma media panels ("Project Hover"
 * inner frames, 850×540) — currently placeholders pending real exports.
 */
const PROJECTS = [
  {
    lines: ['Tours', 'Reality', 'Game'],
    tags: ['UI/X Design', 'iOS App'],
    image: '/projects/tours-reality-game.png',
  },
  {
    lines: ['Sports', 'Content', 'Hub'],
    tags: ['Front End Development', 'UI/X Design', 'Responsive Web App'],
    image: '/projects/sports-content-hub.png',
  },
  {
    lines: ['Voice', 'Pitch', 'Analyzer'],
    tags: ['UI/X Design', 'iOS App'],
    image: '/projects/voice-pitch-analyzer.png',
  },
  {
    lines: ['Vehicle', 'Delivery', 'Service'],
    tags: ['UI/X Design', 'Mobile Web App', 'PWA'],
    image: '/projects/vehicle-delivery-service.png',
  },
  {
    lines: ['Social', 'Charity', 'Platform'],
    tags: ['UI/X Design', 'Web App'],
    image: '/projects/social-charity-platform.png',
  },
];

/** Per-line opacity ramp for the 3-line title block. */
const LINE_OPACITY = ['opacity-75', 'opacity-85', 'opacity-100'];

const SECTION_TITLE: Record<Locale, string> = {
  en: 'Portfolio',
  id: 'Portofolio',
};

export const Portfolio: FC<Props> = ({ locale }) => {
  return (
    <section className="portfolio-section relative z-10 mb-20 px-6 md:mx-auto md:max-w-2xl lg:mb-[120px] lg:max-w-4xl xl:max-w-7xl xl:px-18">
      <PortfolioItemFade />
      <div className="portfolio-heading relative z-[1] flex items-center gap-6 self-start lg:backdrop-blur-[8px] lg:pt-[var(--portfolio-title-gap)] lg:sticky lg:top-[68px] lg:ml-[calc(var(--portfolio-heading-offset)*-1)] xl:top-[76px]">
        <h2 className="font-bold font-headline text-[76px] text-white uppercase leading-[1.0657894737] lg:text-[116px]">
          {SECTION_TITLE[locale]}
        </h2>
        <span aria-hidden="true" className="h-[6px] w-[220px] bg-gold lg:h-[10px] lg:w-[440px]" />
      </div>

      <div className="mt-16 flex flex-col gap-16">
        {PROJECTS.map(({ lines, tags, image }) => (
          <div
            key={lines[0]}
            className="portfolio-item flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <div className="flex w-full flex-col justify-center gap-6 sm:w-[300px] sm:shrink-0">
              <h3 className="font-bold font-general text-3xl text-white italic lg:text-[60px]">
                {lines.map((line, index) => (
                  <span key={line} className={`block ${LINE_OPACITY[index] ?? 'opacity-100'}`}>
                    {line}
                  </span>
                ))}
              </h3>
              <div className="flex flex-wrap justify-start gap-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-gold bg-gold/16 px-1.5 py-1.5 font-general font-medium text-[#f6edcc] text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full border border-gold p-3">
              <div className="relative aspect-[850/540]">
                <Image
                  className="object-cover"
                  src={image}
                  fill
                  sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 767px) calc(100vw - 80px), (max-width: 1023px) 640px, (max-width: 1279px) 848px, 1208px"
                  alt={lines[0]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
