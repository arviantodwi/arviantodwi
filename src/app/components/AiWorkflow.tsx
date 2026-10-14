import Image from 'next/image';
import type { ComponentType, FC } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { DesignIllustration } from './ui/DesignIllustration';
import { DevelopIllustration } from './ui/DevelopIllustration';
import { IconCircleSquare, IconIcosahedron, IconPolygon, type IconProps } from './ui/icons';
import { PlanIllustration } from './ui/PlanIllustration';
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
    <section className="relative z-10 py-20">
      <div className="flex flex-col gap-14 px-6 md:mx-auto md:max-w-2xl lg:max-w-4xl xl:max-w-[1440px] xl:px-30">
        {/* Headline + intro */}
        <div className="flex flex-col gap-4">
          <h2 className="font-general font-semibold text-[40px] leading-[1.125] tracking-[-0.04em] md:text-[48px] md:leading-[60px]">
            {headline[0]}
            <br />
            <span className="font-bold text-gold">{headline[1]}</span>
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
                  <h3 className="whitespace-nowrap font-headline font-semibold text-[26px] uppercase tracking-[-0.02em]">
                    {stage.title}
                  </h3>
                  {(() => {
                    const StageIcon = stage.icon;
                    return <StageIcon size={24} className="select-none text-white" />;
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
            <p className="w-full font-general font-medium text-base md:w-[320px] md:shrink-0">
              <SegmentedText segments={toolkit} />
            </p>
            <div className="flex flex-1 flex-col gap-3 md:h-[60px] md:flex-row">
              {TOOL_LOGOS.map((logo) => (
                <div
                  className="flex items-center md:h-[60px] md:flex-1 md:justify-center"
                  key={logo.name}
                >
                  <Image
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    width={196}
                    height={60}
                    loading="lazy"
                    className="select-none opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
