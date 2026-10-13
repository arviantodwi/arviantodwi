import { getImageProps } from 'next/image';
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
 * Images: flattened exports of the Figma media panels ("Project Hover" inner
 * frames, 850×540). `image` is the WebP primary source, `imageFallback` the
 * PNG served to browsers without WebP support.
 */
const PROJECTS = [
  {
    lines: ['Tours', 'Reality', 'Game'],
    tags: ['UI/X Design', 'iOS App'],
    image: '/projects/tours-reality-game.webp',
    imageFallback: '/projects/tours-reality-game.png',
  },
  {
    lines: ['Sports', 'Content', 'Hub'],
    tags: ['Front End Development', 'UI/X Design', 'Responsive Web App'],
    image: '/projects/sports-content-hub.webp',
    imageFallback: '/projects/sports-content-hub.png',
  },
  {
    lines: ['Voice', 'Pitch', 'Analyzer'],
    tags: ['UI/X Design', 'iOS App'],
    image: '/projects/voice-pitch-analyzer.webp',
    imageFallback: '/projects/voice-pitch-analyzer.png',
  },
  {
    lines: ['Vehicle', 'Delivery', 'Service'],
    tags: ['UI/X Design', 'Mobile Web App', 'PWA'],
    image: '/projects/vehicle-delivery.webp',
    imageFallback: '/projects/vehicle-delivery.png',
  },
  {
    lines: ['Social', 'Charity', 'Platform'],
    tags: ['UI/X Design', 'Web App'],
    image: '/projects/social-charity-platform.webp',
    imageFallback: '/projects/social-charity-platform.png',
  },
];

/** Per-line opacity ramp for the 3-line title block. */
const LINE_OPACITY = ['opacity-50', 'opacity-75', 'opacity-100'];

/** Responsive media-panel sizes, shared by the webp source and png fallback. */
const IMAGE_SIZES =
  '(max-width: 639px) calc(100vw - 48px), (max-width: 767px) calc(100vw - 80px), (max-width: 1023px) 640px, (max-width: 1279px) 848px, (max-width: 1439px) calc(100vw - 240px), 1200px';

const SECTION_TITLE: Record<Locale, string> = {
  en: 'Portfolio',
  id: 'Portofolio',
};

export const Portfolio: FC<Props> = ({ locale }) => {
  const headingBand = (
    <div className="portfolio-heading relative z-1 flex w-full flex-col lg:sticky lg:top-[68px] lg:ml-[calc(50%-50vw)] lg:w-screen lg:items-center lg:pt-[var(--portfolio-title-gap)] lg:backdrop-blur-[8px] xl:top-[76px]">
      <div className="mx-auto flex w-full flex-col px-6 md:px-18 xl:max-w-[1440px] xl:px-30">
        <div className="flex items-center gap-6 self-start xl:-ml-(--portfolio-heading-offset)">
          <h2 className="font-bold font-headline text-[76px] text-white uppercase leading-[1.0657894737] md:text-[84px] xl:text-[116px]">
            {SECTION_TITLE[locale]}
          </h2>
          <span aria-hidden="true" className="h-[6px] w-[220px] bg-gold md:h-[8px] md:w-[260px] xl:h-[10px] xl:w-[440px]" />
        </div>
      </div>
    </div>
  );

  const row = (
    { lines, tags, image, imageFallback }: (typeof PROJECTS)[number],
    fading: boolean,
  ) => (
    <div
      key={lines[0]}
      className={`flex flex-col gap-6 sm:flex-row sm:items-center${fading ? ' portfolio-item' : ''}`}
    >
      <div className="flex w-full flex-col justify-center gap-6 sm:w-[300px] sm:shrink-0">
        <h3 className="font-bold font-general text-3xl text-white italic lg:text-[clamp(48px,4.6875vw,60px)]">
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
          {/* Explicit webp→png fallback chain built from getImageProps: both
              variants flow through the Next image optimizer, modern browsers
              pick the webp source, legacy browsers get the optimized png. */}
          <picture>
            <source
              srcSet={
                getImageProps({
                  src: image,
                  alt: '',
                  fill: true,
                  sizes: IMAGE_SIZES,
                }).props.srcSet
              }
              type="image/webp"
              sizes={IMAGE_SIZES}
            />
            <img
              {...getImageProps({
                src: imageFallback,
                alt: lines.join(' '),
                fill: true,
                sizes: IMAGE_SIZES,
              }).props}
              alt={lines.join(' ')}
            />
          </picture>
        </div>
      </div>
    </div>
  );

  return (
    <section className="portfolio-section relative z-10 mx-auto mb-20 px-6 md:px-18 lg:mb-[120px] xl:max-w-[1440px] xl:px-30">
      <PortfolioItemFade />
      {/* Sticky containing block: ends with the second-to-last row, so the
          band releases and scrolls away naturally once that row is fully
          behind the title. The last row lives outside — regular element,
          no fade. */}
      <div>
        {headingBand}
        <div className="mt-16 flex flex-col gap-16">
          {PROJECTS.slice(0, -1).map((project) => row(project, true))}
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-16">{row(PROJECTS[PROJECTS.length - 1], false)}</div>
    </section>
  );
};
