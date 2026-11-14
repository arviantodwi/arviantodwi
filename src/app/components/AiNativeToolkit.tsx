import Image from 'next/image';
import type { ComponentType, FC, ReactNode } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { cx } from '@/app/lib/utils';
import { DesignIllustration } from './ui/DesignIllustration';
import { DevelopIllustration } from './ui/DevelopIllustration';
import { PlanIllustration } from './ui/PlanIllustration';
import { Section } from './ui/Section';

interface Props {
  dict: Dictionary;
}

/**
 * AI-native — Floating Introduction + Four-Stage Toolkit (Unified Narrative),
 * .pen node T9rslD with the responsive artboards swZ82 (@LG 1024) /
 * HKJ8s (@MD 768) / wKpaA (@SM 640) / GbhRS (@under-SM 375) — 2026-11-13
 * pen pass. The page's AI section (replaced the old AiWorkflow section,
 * removed 2026-11-14; the footer mast's AI anchor points at #ai-native).
 *
 * Structure per the flattened screen tree + breakpoint descendants:
 * - Introduction (pUcyU): narrative column (two-tone headline + three
 *   $text-secondary paragraphs) beside the floating collage at lg+; below
 *   lg the artboards stack the narrative and DISABLE the intro copy of the
 *   collage, re-parenting it INSIDE the band below the matrix (ukQxJ /
 *   Bo2m3 / E4LxRt — left/right/center stagger). Headline 40px below sm /
 *   48px from sm (owner override 2026-11-14 over the pen's 28/32/36/40/48
 *   artboard scale) with the pen's absolute −1.92px tracking at every size.
 * - Floating collage (pen LMgxo): aspect-locked canvas, the three stage
 *   cards pinned at %-coordinates so each canvas scales as one unit —
 *   55.23%-wide cards in both variants; interiors are the same traced
 *   compositions the first section renders (ui/PlanIllustration,
 *   ui/DesignIllustration, ui/DevelopIllustration) — reused, per the
 *   handoff's build-once rule; shells = fills + 1px #30302B border +
 *   0 12px 28px #00000066 shadow. The pen's 1–2px backdrop-blur on the
 *   opaque cards is invisible and skipped.
 * - AI toolkit (NC4YD): two ambient ribbon arcs behind a glass band
 *   (#0A0A08CC, 1px #292924, backdrop-blur 20) with a 2px horizontal
 *   signal-trace gradient and four instrument stations — 4-up at lg+
 *   (stations padding 16 / stages 44 / overlines 9px / logos capped 192 /
 *   strips stacked vertical), 2×2 at sm–md, 1 column at uSM (padding
 *   12/12/16/12, stages 44, strips [6,8]). The pen's "Anchored header
 *   band" and "Conduit telemetry bar" stay enabled=false — not rendered.
 * - The artboard gutters match the Section shell at every tier
 *   (24/32/48/64/120); the pen's vertical frame paddings map to the body
 *   wrapper's rhythm (py-0 section, internal joints 48 below lg / 64 lg+).
 */

const FLOATING_CARDS: {
  key: 'plan' | 'design' | 'develop';
  Illustration: ComponentType<{ className?: string; ariaLabel: string }>;
  shell: string;
}[] = [
  { key: 'plan', Illustration: PlanIllustration, shell: 'bg-[#10100d]' },
  { key: 'design', Illustration: DesignIllustration, shell: 'bg-[#14140f]' },
  { key: 'develop', Illustration: DevelopIllustration, shell: 'bg-[#0d0d0d]' },
];

/**
 * Collage geometry per variant (pen LMgxo at xl/lg; ukQxJ / Bo2m3 / E4LxRt
 * below lg): card width is 55.23% of the canvas in both; the intro canvas
 * keeps the XL stagger, the below-grid canvas re-points it left / right /
 * center with an even vertical rhythm. Card interiors scale with the
 * canvas, so the reused illustration SVGs track the shells automatically.
 */
const COLLAGE_VARIANTS = {
  /** Intro row (pen LMgxo 676×463, ×0.72 at lg) — XL stagger. */
  intro: {
    aspect: 'aspect-[676/463]',
    positions: [
      'left-[2.663%] top-[3.888%] -rotate-3',
      'left-[36.09%] top-[33.7%] rotate-3',
      'left-[10.95%] top-[64.79%] -rotate-2',
    ],
  },
  /** Below the toolkit grid (pen ukQxJ 672×424 family) — L/R/C stagger. */
  below: {
    aspect: 'aspect-[672/424]',
    positions: [
      'left-0 top-0 -rotate-3',
      'left-[43.8%] top-[33%] rotate-3',
      'left-[22.05%] top-[66%] -rotate-2',
    ],
  },
} as const;

const FloatingCollage: FC<{
  variant: keyof typeof COLLAGE_VARIANTS;
  labels: Dictionary['aiToolkit']['cards'];
}> = ({ variant, labels }) => {
  const { aspect, positions } = COLLAGE_VARIANTS[variant];
  return (
    <div className={`relative ${aspect} w-full`}>
      {FLOATING_CARDS.map(({ key, Illustration, shell }, index) => (
        <div className={`absolute w-[55.23%] ${positions[index]}`} key={key}>
          <div
            className={cx('border border-[#30302b] shadow-[0_12px_28px_rgba(0,0,0,0.4)]', shell)}
          >
            <Illustration ariaLabel={labels[key]} className="h-auto w-full select-none" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Four-stage toolkit stations (pen OTmUQ + the replaced @MD/@SM/@uSM
 * subtrees). Strip labels and model names are design labels (proper nouns
 * / mono-caps, locale-independent); overlines + titles + descriptions are
 * dictionary copy (dict.aiToolkit.stations). Logos are the lockups
 * extracted from the .pen tree into public/ai-native/*.svg.
 */
const STATIONS: {
  key: 'specs' | 'design' | 'engineering' | 'test';
  logo: { name: string; src: `/ai-native/${string}.svg`; width: number; height: number };
  stripLabel: string;
  stripLabelClass: string;
  chips: string[];
  shell: string;
}[] = [
  {
    key: 'specs',
    logo: { name: 'Obsidian', src: '/ai-native/obsidian.svg', width: 244, height: 43 },
    stripLabel: 'MODELS',
    stripLabelClass: 'font-normal',
    chips: ['GLM 5.3 Flash', 'GPT 6 Luna'],
    shell: '',
  },
  {
    key: 'design',
    logo: { name: 'pen.dev', src: '/ai-native/pen-dev.svg', width: 207, height: 44 },
    stripLabel: 'MODELS',
    stripLabelClass: 'font-normal',
    chips: ['Gemini 4 Argon'],
    shell: '',
  },
  {
    key: 'engineering',
    logo: { name: 'OpenChamber', src: '/ai-native/openchamber.svg', width: 244, height: 42 },
    stripLabel: 'MODELS',
    stripLabelClass: 'font-medium',
    chips: ['GLM 5.3', 'GLM 5.3 Flash'],
    shell: 'bg-[#0e0e0a]',
  },
  {
    key: 'test',
    logo: { name: 'Fallow', src: '/ai-native/fallow.svg', width: 138, height: 44 },
    stripLabel: 'SUPPORTING MODELS',
    stripLabelClass: 'font-normal',
    chips: ['Deepseek v4.1'],
    shell: 'bg-[#10100b]',
  },
];

/**
 * Station cell separators + padding per tier (pen): 1px #22221D strokes —
 * 4-up right strokes at lg+; 2×2 right+bottom at sm–md (odd columns right,
 * bottom row borderless); stacked bottom strokes at uSM. Padding 20 at
 * xl/md, 16 at lg/sm, 12 sides + 16 bottom at uSM.
 */
const STATION_CELL =
  'flex flex-col gap-4 border-b border-[#22221d] max-sm:px-3 max-sm:pt-3 max-sm:pb-4 sm:p-4 md:p-5 lg:p-4 xl:p-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0';

const StationNarrative: FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="flex flex-col gap-1">
    <h3 className="font-general text-[13px] leading-[1.35] font-bold tracking-[-0.1px] text-white">
      {title}
    </h3>
    <p className="font-general text-xs leading-[1.4] text-white/60">{description}</p>
  </div>
);

export const AiNativeToolkit: FC<Props> = ({ dict }) => {
  const { aiToolkit } = dict;
  const { headline, paragraphs, stations } = aiToolkit;

  const renderStation = (station: (typeof STATIONS)[number]): ReactNode => {
    const copy = stations[station.key];
    return (
      <div className={cx(STATION_CELL, station.shell)} key={station.key}>
        {/* Station telemetry header (pen Node id) — dictionary overline */}
        <p className="font-mono text-[10px] font-medium tracking-[0.7px] text-white/80 lg:text-[9px]">
          {copy.overline}
        </p>
        {/* Logo stage (pen 52 tall; 44 at lg + uSM; opacity .95) */}
        <div className="flex h-[44px] items-center opacity-95 sm:h-[52px] lg:h-[44px] xl:h-[52px]">
          <Image
            alt={`${station.logo.name} logo`}
            className="h-auto w-auto max-w-full select-none lg:max-w-[192px] xl:max-w-none"
            height={station.logo.height}
            loading="lazy"
            src={station.logo.src}
            width={station.logo.width}
          />
        </div>
        {/* Model routing strip (pen lsH6d family): horizontal 36px; stacked
            label-over-chips at lg only (xl restores the inline row); [6,8]
            padding at uSM */}
        <div className="flex h-9 items-center justify-between gap-2 border border-[#36321d] bg-[#14130c] px-2.5 py-2 max-sm:h-auto max-sm:px-2 max-sm:py-1.5 lg:h-auto lg:flex-col lg:items-start lg:justify-start lg:gap-1.5 xl:h-9 xl:flex-row xl:items-center xl:justify-between xl:gap-2">
          <span
            className={cx(
              'font-mono text-[9px] tracking-[0.6px] text-gold',
              station.stripLabelClass,
            )}
          >
            {station.stripLabel}
          </span>
          <span className="flex items-center gap-1.5">
            {station.chips.map((chip) => (
              <span
                className="border border-[#e3b60059] bg-[#1f1d12] px-[5px] py-[3px] font-mono text-[10px] font-semibold text-white"
                key={chip}
              >
                {chip}
              </span>
            ))}
          </span>
        </div>
        {/* Station narrative (pen HTFo2 family) — Plus Jakarta Sans */}
        <StationNarrative title={copy.title} description={copy.description} />
      </div>
    );
  };

  return (
    <Section id="ai-native" className="py-0">
      <div className="flex flex-col gap-12 lg:gap-16">
        {/* Introduction — Floating process (pen pUcyU): narrative ∥ collage
            row at lg+ (486.72px collage at lg, 676px at xl); stacked below
            lg with the collage re-parented into the band. */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center xl:gap-16">
          {/* Narrative (pen mMWFv): 460px at xl, fill_container at lg */}
          <div className="flex flex-col gap-5 lg:min-w-0 lg:flex-1 xl:w-[460px] xl:flex-none xl:shrink-0">
            <h2 className="font-general text-[40px] leading-[1.25] font-semibold tracking-[-1.92px] sm:text-[48px]">
              {headline[0]}
              <br />
              <span className="text-gold font-bold">{headline[1]}</span>
            </h2>
            {/* Perspective (pen t6wBXy): three $text-secondary paragraphs */}
            <div className="flex flex-col gap-3.5">
              {paragraphs.map((paragraph) => (
                <p
                  className="font-general text-base leading-[1.5] text-white/75 max-sm:text-[15px]"
                  key={paragraph.slice(0, 24)}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Connected process — Floating illustrations (pen LMgxo): one
              aspect-locked canvas, cards pinned at %-coordinates. */}
          <div className="max-lg:hidden lg:w-[486.72px] lg:shrink-0 xl:w-[676px]">
            <FloatingCollage variant="intro" labels={aiToolkit.cards} />
          </div>
        </div>

        {/* AI toolkit — Four-stage workflow (pen NC4YD). The wrapper is the
            arc canvas: both ribbons anchor to the band's center line with
            per-tier offsets (globals.css .ai-arc-*) and bleed above the
            glass like the artboard; the page-level overflow-x clip absorbs
            the horizontal bleed. */}
        <div className="relative">
          {/* Ambient ribbon arc — primary gold (pen wDgkw): only the thick
              right region crests the glass edge, as in the artboards. */}
          <svg
            aria-hidden="true"
            className="ai-arc-primary"
            viewBox="0 0 1600 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ai-native-arc-primary" x1="0" y1="0.5" x2="1" y2="0.5">
                <stop offset="0" stopColor="#ff9200" stopOpacity="0" />
                <stop offset="0.22" stopColor="#e3b600" stopOpacity="0.22" />
                <stop offset="0.52" stopColor="#ffca1a" stopOpacity="0.4" />
                <stop offset="0.78" stopColor="#708da9" stopOpacity="0.19" />
                <stop offset="1" stopColor="#ff9200" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 210c360-170 720 50 1120-130 200-70 360 10 480-40l0 110c-160 40-340-30-540 30-380 120-720-70-1060 70z"
              fill="url(#ai-native-arc-primary)"
            />
          </svg>
          {/* Ambient ribbon arc — secondary ember (pen k8R2jD): its ribbon
              sits almost entirely behind the glass like the artboards. */}
          <svg
            aria-hidden="true"
            className="ai-arc-secondary"
            viewBox="0 0 1320 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ai-native-arc-secondary" x1="0" y1="0.5" x2="1" y2="0.5">
                <stop offset="0" stopColor="#e3b600" stopOpacity="0" />
                <stop offset="0.45" stopColor="#fff29c" stopOpacity="0.33" />
                <stop offset="0.8" stopColor="#e3b600" stopOpacity="0.19" />
                <stop offset="1" stopColor="#040404" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 60c320 130 680-80 1040 60 140 50 220-10 280-40l0 55c-100 40-200 60-340 15-340-120-680 70-980-40z"
              fill="url(#ai-native-arc-secondary)"
            />
          </svg>

          {/* Signal conduit matrix — Unified 4-Stage (pen OTmUQ): glass band
              + luminous top trace + instrument stations. */}
          <div className="relative border border-[#292924] bg-[#0a0a08]/80 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-[20px]">
            {/* Luminous top signal trace (pen P8qhbc) */}
            <div className="h-[2px] bg-[linear-gradient(90deg,#e3b60022_0%,#e3b600_28%,#fff29c_50%,#708da9aa_78%,#29292944_100%)]" />
            {/* Instrument stations (pen r1NnoT family): 4-up at lg+, 2×2 at
                sm–md, 1 column at uSM */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">{STATIONS.map(renderStation)}</div>
          </div>

          {/* Connected process — Floating illustrations, re-parented below
              the matrix at uSM/SM/MD (pen ukQxJ / Bo2m3 / E4LxRt, 40px
              after the band): L/R/C stagger, full content width. */}
          <div className="mt-10 lg:hidden">
            <FloatingCollage variant="below" labels={aiToolkit.cards} />
          </div>
        </div>
      </div>
    </Section>
  );
};
