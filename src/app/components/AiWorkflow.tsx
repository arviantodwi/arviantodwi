import Image from 'next/image';
import type { ComponentType, FC } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { DesignIllustration } from './ui/DesignIllustration';
import { DevelopIllustration } from './ui/DevelopIllustration';
import { IconCircleSquare, IconIcosahedron, IconPolygon, type IconProps } from './ui/icons';
import { PlanIllustration } from './ui/PlanIllustration';
import { Section } from './ui/Section';
import { SegmentedText } from './ui/SegmentedText';

interface Props {
  dict: Dictionary;
}

/** Animated inline illustrations per stage; `null` = static <Image> svg. */
const ANIMATED_ILLUSTRATION: Partial<
  Record<'plan' | 'design' | 'develop', ComponentType<{ className?: string; ariaLabel: string }>>
> = {
  plan: PlanIllustration,
  design: DesignIllustration,
  develop: DevelopIllustration,
};

/**
 * PLAN / DESIGN / DEVELOP stage cards. Visual per docs/figma.md + owner
 * request: only the container (bg + 1px border) is code — the inner
 * composition is a vector export (374×132 SVG). All three render inline
 * via animated illustration components (CSS keyframes per card in
 * globals.css): ui/PlanIllustration, ui/DesignIllustration (7.2s draw
 * loops) and ui/DevelopIllustration (static composition + blinking
 * caret). Their static export twins remain in `public/ai-native-*.svg`.
 */
const STAGES: {
  key: 'plan' | 'design' | 'develop';
  title: string;
  icon: ComponentType<IconProps>;
  image: `/ai-native-${string}.svg`;
  shell: string;
}[] = [
  {
    key: 'plan' as const,
    title: 'Plan',
    icon: IconPolygon,
    image: '/ai-native-plan.svg',
    shell: 'bg-[#10100d] border-[#292929]',
  },
  {
    key: 'design' as const,
    title: 'Design',
    icon: IconCircleSquare,
    image: '/ai-native-design.svg',
    shell: 'bg-[#14140f] border-[#2b2a1e]',
  },
  {
    key: 'develop' as const,
    title: 'Develop',
    icon: IconIcosahedron,
    image: '/ai-native-dev.svg',
    shell: 'bg-[#0d0d0d] border-[#292929]',
  },
];

/** Pre-composed 196×60 logo cells exported straight from the Figma frame. */
const TOOL_LOGOS = [
  { name: 'OpenCode', src: '/techstack/ai/opencode.svg' },
  { name: 'Figma', src: '/techstack/ai/figma.svg' },
  { name: 'OpenAI', src: '/techstack/ai/openai.svg' },
  { name: 'Gemini', src: '/techstack/ai/gemini.svg' },
];

/** Responsive sizes for the 3-up (lg) / md half (md) / stacked stage illustrations. */
const IMAGE_SIZES =
  '(max-width: 639px) calc(100vw - 48px), (max-width: 767px) calc(100vw - 64px), (max-width: 1023px) 324px, (max-width: 1279px) 272px, 373px';

export const AiWorkflow: FC<Props> = ({ dict }) => {
  const { aiWorkflow } = dict;
  const { headline, intro, stages, toolkit } = aiWorkflow;

  return (
    <Section id="human-ai" className="py-0">
      {/* Inner shell = plain div: the outer Section carries the tiers'
          gutters — nested shells would double-pad (D1). Block pad stays 0
          at every width: the body gap is the rhythm; only Tech
          Stack/Portfolio keep their block padding. */}
      {/* uSM pen (2026-11-02) tightens this stack: 32px joints below 640;
          from sm the legacy 56px rhythm applies (@MD = pen, @SM waived this
          tier per owner scope). */}
      <div className="flex flex-col gap-14 max-sm:gap-8">
        {/* Headline + intro */}
        <div className="flex flex-col gap-4">
          <h2 className="font-general text-[40px] leading-[1.125] font-semibold tracking-[-0.04em] max-sm:tracking-[-0.048em] md:text-[48px] md:leading-[60px]">
            {headline[0]}
            <br />
            <span className="text-gold font-bold">{headline[1]}</span>
          </h2>
          <p className="font-general text-base leading-6">
            <SegmentedText segments={intro} />
          </p>
        </div>

        {/* Workflow stages: 3-col grid from lg; single stacked column below.
            At md/sm (600–1023) each stage row is horizontal — narrative left,
            artwork right, equal halves with a 24px gap (artwork height follows
            the 373:132 ratio of its half width). Vertical stage below md. */}
        <div className="flex flex-col gap-10 max-sm:gap-8 lg:grid lg:grid-cols-3">
          {STAGES.map((stage) => (
            <div
              className="flex flex-col gap-5 max-sm:gap-4 md:max-lg:flex-row md:max-lg:items-start md:max-lg:gap-6"
              key={stage.key}
            >
              <div className="flex flex-col gap-3 max-sm:gap-1 md:max-lg:min-w-0 md:max-lg:flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-[26px] font-semibold tracking-[-0.02em] whitespace-nowrap uppercase">
                    {stage.title}
                  </h3>
                  {(() => {
                    const StageIcon = stage.icon;
                    return <StageIcon size={24} className="text-white select-none" />;
                  })()}
                </div>
                <p className="font-general text-sm opacity-75 max-sm:leading-[22px]">
                  {stages[stage.key].description}
                </p>
              </div>
              <div
                className={`overflow-hidden border md:max-lg:min-w-0 md:max-lg:flex-1 ${stage.shell}`}
              >
                {(() => {
                  const Animated = ANIMATED_ILLUSTRATION[stage.key];
                  return Animated ? (
                    <Animated
                      className="h-auto w-full select-none"
                      ariaLabel={stages[stage.key].imageAlt}
                    />
                  ) : (
                    <Image
                      src={stage.image}
                      alt={stages[stage.key].imageAlt}
                      width={374}
                      height={132}
                      loading="lazy"
                      sizes={IMAGE_SIZES}
                      className="h-auto w-full select-none"
                    />
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* AI toolkit: side-by-side from lg (320px description + logos,
            which wrap to 2 rows at lg); stacked below. */}
        <div className="flex flex-col gap-7">
          <div className="h-px bg-[#292929]" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-[60px]">
            <p className="font-general w-full text-base font-medium max-sm:text-center lg:w-[320px] lg:shrink-0">
              <SegmentedText segments={toolkit} />
            </p>
            {/* Below sm: 2-column grid with left-aligned, natural-size logos.
                From sm to lg: one centered row with four equal, shrinkable
                cells. At lg: 2×2 grid of 60px cells (pen wraps to 2 rows);
                from xl: single full row again. */}
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:max-lg:flex sm:max-lg:h-[60px] sm:max-lg:flex-row lg:h-auto xl:flex xl:h-[60px] xl:flex-row">
              {TOOL_LOGOS.map((logo) => (
                <div
                  className="flex items-center sm:max-lg:h-[60px] sm:max-lg:min-w-0 sm:max-lg:flex-1 sm:max-lg:justify-center xl:h-[60px] xl:min-w-0 xl:flex-1 xl:justify-center"
                  key={logo.name}
                >
                  <Image
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    width={196}
                    height={60}
                    loading="lazy"
                    className="h-auto w-auto max-w-full opacity-50 select-none sm:max-lg:w-full sm:max-lg:max-w-[196px] lg:h-[60px] lg:w-full lg:max-w-none lg:object-cover lg:object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
