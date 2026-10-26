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

/** Responsive sizes for the 3-up (xl) / stacked (below) stage illustrations. */
const IMAGE_SIZES =
  '(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 640px, (max-width: 1279px) calc((min(100vw, 896px) - 80px) / 3), (max-width: 1439px) calc((100vw - 240px) / 3), 373px';

export const AiWorkflow: FC<Props> = ({ dict }) => {
  const { aiWorkflow } = dict;
  const { headline, intro, stages, toolkit } = aiWorkflow;

  return (
    <Section id="human-ai" className="py-20">
      {/* Inner shell: the outer Section already carries the 24px gutter on
          mobile — no extra inline padding inside it (sm+ keeps the double
          shell until its own pass). */}
      <Section as="div" className="flex flex-col gap-14 px-0 sm:px-6">
        {/* Headline + intro */}
        <div className="flex flex-col gap-4">
          <h2 className="font-general text-[40px] leading-[1.125] font-semibold tracking-[-0.04em] md:text-[48px] md:leading-[60px]">
            {headline[0]}
            <br />
            <span className="text-gold font-bold">{headline[1]}</span>
          </h2>
          <p className="font-general text-base leading-6">
            <SegmentedText segments={intro} />
          </p>
        </div>

        {/* Workflow stages */}
        <div className="flex flex-col gap-10 md:grid md:grid-cols-3 md:gap-10">
          {STAGES.map((stage) => (
            <div className="flex flex-col gap-5" key={stage.key}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-[26px] font-semibold tracking-[-0.02em] whitespace-nowrap uppercase">
                    {stage.title}
                  </h3>
                  {(() => {
                    const StageIcon = stage.icon;
                    return <StageIcon size={24} className="text-white select-none" />;
                  })()}
                </div>
                <p className="font-general text-sm opacity-75">{stages[stage.key].description}</p>
              </div>
              <div className={`overflow-hidden border ${stage.shell}`}>
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

        {/* AI toolkit */}
        <div className="flex flex-col gap-7">
          <div className="h-px bg-[#292929]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-[60px]">
            <p className="font-general w-full text-base font-medium md:w-[320px] md:shrink-0">
              <SegmentedText segments={toolkit} />
            </p>
            {/* Below sm: 2-column grid with left-aligned, natural-size logos.
                From sm: one centered row with four equal, shrinkable cells. */}
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:flex sm:h-[60px] sm:flex-row">
              {TOOL_LOGOS.map((logo) => (
                <div
                  className="flex items-center sm:h-[60px] sm:min-w-0 sm:flex-1 sm:justify-center"
                  key={logo.name}
                >
                  <Image
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    width={196}
                    height={60}
                    loading="lazy"
                    className="h-auto w-auto max-w-full opacity-50 select-none sm:w-full sm:max-w-[196px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </Section>
  );
};
