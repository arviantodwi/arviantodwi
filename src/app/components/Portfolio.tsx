import type { FC } from 'react';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { cx } from '@/app/lib/utils';
import { PortfolioItemFade } from './ui/PortfolioItemFade';
import { ProjectCard } from './ui/ProjectCard';
import { Section } from './ui/Section';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Project entries are proper nouns, kept identical across locales.
 * Descriptions + tagline live in the dictionaries (see dict.portfolio).
 * Images: flattened exports of the Figma media panels. `image` is the
 * WebP primary source, `imageFallback` the PNG served to browsers without
 * WebP support — both are placeholders awaiting the owner's exports
 * (same paths, zero code change). `surface` paints the Figma preview
 * surface behind/around the flat image export.
 * Layout per Figma node 681-441: one featured `wide` project, then two
 * rows of two `compact` cards. Links: TBD per project (none shipped yet —
 * pass a `href` to light up the arrow button).
 */
const PROJECTS = [
  {
    key: 'tours',
    title: 'Tours Reality Game',
    tags: ['UI/X Design', 'iOS App'],
    image: '/projects/tours-reality-game.webp',
    imageFallback: '/projects/tours-reality-game.png',
    surface: 'bg-[#003748]',
  },
  {
    key: 'sports',
    title: 'Sports Content Hub',
    tags: ['Front End Development', 'UI/X Design', 'Responsive Web App'],
    image: '/projects/sports-content-hub.webp',
    imageFallback: '/projects/sports-content-hub.png',
    surface: 'bg-[#f8d178]',
  },
  {
    key: 'voice',
    title: 'Voice Pitch Analyzer',
    tags: ['UI/X Design', 'iOS App'],
    image: '/projects/voice-pitch-analyzer.webp',
    imageFallback: '/projects/voice-pitch-analyzer.png',
    surface: 'bg-gradient-to-b from-[#fd65a5] to-[#fd8769]',
  },
  {
    key: 'vehicle',
    title: 'Vehicle Delivery Service',
    tags: ['UI/X Design', 'Mobile Web App', 'PWA'],
    image: '/projects/vehicle-delivery.webp',
    imageFallback: '/projects/vehicle-delivery.png',
    surface: 'bg-[#231f20]',
  },
  {
    key: 'charity',
    title: 'Social Charity Platform',
    tags: ['UI/X Design', 'Web App'],
    image: '/projects/social-charity-platform.webp',
    imageFallback: '/projects/social-charity-platform.png',
    surface: 'bg-[linear-gradient(115deg,#95eff1_0%,#f3b957_32%,#f2df98_59%,#ef798a_100%)]',
  },
] as const;

const SECTION_TITLE: Record<Locale, string> = {
  en: 'Portfolio',
  id: 'Portofolio',
};

export const Portfolio: FC<Props> = ({ locale, dict }) => {
  const headingBand = (
    <div className="portfolio-heading relative z-1 flex w-full flex-col sm:sticky sm:top-[60px] sm:pt-[var(--portfolio-title-gap)] sm:backdrop-blur-[8px] md:top-[68px] lg:ml-[calc(50%-50vw)] lg:w-screen lg:items-center xl:top-[76px]">
      <div className="mx-auto flex w-full flex-col px-0 lg:px-18 xl:max-w-[1440px] xl:px-30">
        <div className="flex w-full flex-col gap-[24px]">
          {/* From sm, the tagline sits 24px to the right of the wordmark,
              bottom-aligned and wrapping into the available width. */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-[24px] sm:self-stretch">
            <h2
              className={cx(
                'font-headline text-[76px] leading-[1.08] font-bold text-white uppercase sm:max-lg:shrink-0 md:text-[84px] xl:text-[112px]',
                locale === 'id' && 'max-sm:text-[64px]',
              )}
            >
              {SECTION_TITLE[locale]}
            </h2>
            <p className="font-general text-[16px] leading-[1.6] text-white/75 sm:max-lg:min-w-0 sm:max-lg:flex-1 lg:w-[420px] lg:shrink-0">
              <span className="block">{dict.portfolio.tagline.muted}</span>
              <span className="block text-white">{dict.portfolio.tagline.plain}</span>
            </p>
          </div>
          {/* Section divider */}
          <div aria-hidden="true" className="h-px w-full bg-white/15" />
        </div>
      </div>
    </div>
  );

  const card = (project: (typeof PROJECTS)[number], fading: boolean) => (
    <ProjectCard
      key={project.key}
      variant={project.key === 'tours' ? 'wide' : 'compact'}
      title={project.title}
      tags={[...project.tags]}
      description={dict.portfolio.projects[project.key].description}
      image={project.image}
      imageFallback={project.imageFallback}
      surface={project.surface}
      alt={project.title}
      className={fading ? 'portfolio-item' : undefined}
    />
  );

  return (
    <Section
      id="portfolio"
      className="portfolio-section scroll-mt-[84px] md:max-w-none md:scroll-mt-[92px] md:px-18 lg:pt-20 lg:max-w-none xl:scroll-mt-[100px] xl:pb-20"
    >
      <PortfolioItemFade />
      {/* The fade hook (.portfolio-item, ui/PortfolioItemFade.tsx) sits on
          every card. Rows 1–2 are inside the sticky band's containing block
          — their exit fade is driven by the pinned title. The last row
          lives outside (the band has already released by then, so its exit
          factor never engages) but still gets the same scroll-in entry
          fade as every other row. */}
      <div>
        {headingBand}
        <div className="mt-12 flex flex-col gap-12 md:gap-[48px]">
          {card(PROJECTS[0], true)}
          <div className="flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-x-[32px] md:gap-y-[48px]">
            {card(PROJECTS[1], true)}
            {card(PROJECTS[2], true)}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-12 md:flex-row md:items-start md:gap-[32px]">
        {card(PROJECTS[3], true)}
        {card(PROJECTS[4], true)}
      </div>
    </Section>
  );
};
