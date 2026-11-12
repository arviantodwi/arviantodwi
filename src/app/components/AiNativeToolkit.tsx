import Image from 'next/image';
import type { ComponentType, FC } from 'react';
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
 * .pen node T9rslD (penhand handoff 2026-11-12, checksum 14f6c7b4789c…).
 * Rendered BELOW the original AiWorkflow section (both live on the page).
 *
 * Structure per the flattened screen tree:
 * - Introduction (pUcyU): 460px narrative column (48px two-tone headline +
 *   three $text-secondary paragraphs) beside a 676×463 floating collage of
 *   the three stage cards (Plan −3° @ 18,18 · Design +3° @ 244,156 ·
 *   Develop −2° @ 74,300). The cards' interiors are the same traced
 *   compositions the first section renders (ui/PlanIllustration,
 *   ui/DesignIllustration, ui/DevelopIllustration) — reused, per the
 *   handoff's build-once rule; their shells move here (fills + 1px
 *   #30302B border + 0 12px 28px #00000066 shadow). The pen's 1–2px
 *   backdrop-blur on the opaque cards is invisible and skipped.
 * - AI toolkit (NC4YD): two ambient ribbon arcs behind a glass band
 *   (#0A0A08CC, 1px #292924, backdrop-blur 20) with a 2px horizontal
 *   signal-trace gradient and four instrument stations (overline, logo
 *   stage, model strip, narrative). The pen's "Anchored header band"
 *   (cCTFV) and "Conduit telemetry bar" (eMYZ9) are enabled=false in the
 *   source and absent from the export — intentionally not rendered.
 *
 * No responsive artboards exist in the bundle; adaptations (documented in
 * docs/structure.md + docs/design.md): the collage scales as one unit via
 * %-positioned cards; the station grid is 4-up at xl (design exact), 2×2
 * from md, 1 column below md. The pen's frame paddings (intro pt-72/pb-32,
 * toolkit pt-32/pb-72) map to the body wrapper's rhythm: py-0 section, the
 * 64px intro→band joint as an internal gap, body gaps above/below.
 */

/** Floating collage geometry (pen LMgxo): % positions of the 55.23%-wide
    cards so the whole canvas scales as one unit at every width. */
const FLOATING_CARDS: {
  key: 'plan' | 'design' | 'develop';
  Illustration: ComponentType<{ className?: string; ariaLabel: string }>;
  shell: string;
  position: string;
}[] = [
  {
    key: 'plan',
    Illustration: PlanIllustration,
    shell: 'bg-[#10100d]',
    position: 'left-[2.663%] top-[3.888%] -rotate-3',
  },
  {
    key: 'design',
    Illustration: DesignIllustration,
    shell: 'bg-[#14140f]',
    position: 'left-[36.09%] top-[33.7%] rotate-3',
  },
  {
    key: 'develop',
    Illustration: DevelopIllustration,
    shell: 'bg-[#0d0d0d]',
    position: 'left-[10.95%] top-[64.79%] -rotate-2',
  },
];

/**
 * Four-stage toolkit stations (pen OTmUQ). Overlines, strip labels and
 * model names are design labels (like AiWorkflow's stage titles — proper
 * nouns / mono-caps, locale-independent); titles + descriptions are
 * dictionary copy (dict.aiToolkit.stations). Logos are the lockups
 * extracted from the .pen tree into public/ai-native/*.svg.
 */
const STATIONS: {
  key: 'specs' | 'design' | 'engineering' | 'test';
  overline: string;
  logo: { name: string; src: `/ai-native/${string}.svg`; width: number; height: number };
  stripLabel: string;
  stripLabelClass: string;
  chips: string[];
  shell: string;
}[] = [
  {
    key: 'specs',
    overline: 'SPECS & PLAN',
    logo: { name: 'Obsidian', src: '/ai-native/obsidian.svg', width: 244, height: 43 },
    stripLabel: 'MODELS',
    stripLabelClass: 'font-normal',
    chips: ['GLM 5.3 Flash', 'GPT 6 Luna'],
    shell: '',
  },
  {
    key: 'design',
    overline: 'DESIGN SYSTEM & UI COMPOSITION',
    logo: { name: 'pen.dev', src: '/ai-native/pen-dev.svg', width: 207, height: 44 },
    stripLabel: 'MODELS',
    stripLabelClass: 'font-normal',
    chips: ['Gemini 4 Argon'],
    shell: '',
  },
  {
    key: 'engineering',
    overline: 'AI-ASSISTED ENGINEERING',
    logo: { name: 'OpenChamber', src: '/ai-native/openchamber.svg', width: 244, height: 42 },
    stripLabel: 'MODELS',
    stripLabelClass: 'font-medium',
    chips: ['GLM 5.3', 'GLM 5.3 Flash'],
    shell: 'bg-[#0e0e0a]',
  },
  {
    key: 'test',
    overline: 'TEST & REVIEW',
    logo: { name: 'Fallow', src: '/ai-native/fallow.svg', width: 138, height: 44 },
    stripLabel: 'SUPPORTING MODELS',
    stripLabelClass: 'font-normal',
    chips: ['Deepseek v4.1'],
    shell: 'bg-[#10100b]',
  },
];

/** Station cell separators per tier: 1px #22221D right strokes between
    columns (pen) — bottom strokes join the stacked/2×2 adaptations. */
const STATION_CELL =
  'flex flex-col gap-4 border-b border-[#22221d] p-5 last:border-b-0 md:[&:nth-child(odd)]:border-r md:[&:nth-child(n+3)]:border-b-0 xl:border-b-0 xl:border-r xl:last:border-r-0';

export const AiNativeToolkit: FC<Props> = ({ dict }) => {
  const { aiToolkit } = dict;
  const { headline, paragraphs, stations } = aiToolkit;

  return (
    <Section id="ai-native" className="py-0">
      <div className="flex flex-col gap-16">
        {/* Introduction — Floating process (pen pUcyU): narrative column +
            floating collage, side by side from xl (design exact), stacked
            below with the same 64px joint. */}
        <div className="flex flex-col gap-16 xl:flex-row xl:items-center">
          {/* Narrative (pen mMWFv, 460px) */}
          <div className="flex max-w-[460px] flex-col gap-5 xl:w-[460px] xl:shrink-0">
            <h2 className="font-general text-[40px] leading-[1.25] font-semibold tracking-[-0.04em] max-md:tracking-[-0.048em] md:text-[48px]">
              {headline[0]}
              <br />
              <span className="text-gold font-bold">{headline[1]}</span>
            </h2>
            {/* Perspective (pen t6wBXy): three $text-secondary paragraphs */}
            <div className="flex flex-col gap-3.5">
              {paragraphs.map((paragraph) => (
                <p
                  className="font-general text-base leading-[1.5] text-white/75"
                  key={paragraph.slice(0, 24)}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Connected process — Floating illustrations (pen LMgxo, 676×463):
              one aspect-locked canvas, cards pinned at %-coordinates. */}
          <div className="relative mx-auto aspect-[676/463] w-full max-w-[676px] xl:mx-0 xl:w-[676px] xl:shrink-0">
            {FLOATING_CARDS.map(({ key, Illustration, position, shell }) => (
              <div className={`absolute w-[55.23%] ${position}`} key={key}>
                <div
                  className={cx(
                    'border border-[#30302b] shadow-[0_12px_28px_rgba(0,0,0,0.4)]',
                    shell,
                  )}
                >
                  <Illustration
                    ariaLabel={aiToolkit.cards[key]}
                    className="h-auto w-full select-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI toolkit — Four-stage workflow (pen NC4YD). The wrapper is the
            arc canvas: both ribbons anchor to the band's center line (pen
            centers them on the 1200px content) and bleed above the glass
            like the artboard; the page-level overflow-x clip absorbs the
            horizontal bleed. */}
        <div className="relative">
          {/* Ambient ribbon arc — primary gold (pen wDgkw): anchored to the
              band center +120px; its ribbon sits mostly behind the glass —
              only the thick right region crests the top edge, as in the
              artboard export (empirically matched: top −125). */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-[-125px] left-1/2 h-[260px] w-[1600px] -translate-x-[calc(50%-120px)] opacity-[0.55] blur-[36px]"
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
          {/* Ambient ribbon arc — secondary ember (pen k8R2jD: x 120 / y −20
              against the content box → band center +180px, its ribbon almost
              entirely behind the glass like the artboard) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-[-20px] left-1/2 h-[190px] w-[1320px] -translate-x-[calc(50%-180px)] opacity-[0.45] blur-[24px]"
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
            {/* Instrument stations (pen r1NnoT): 4-up at xl, 2×2 from md */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4">
              {STATIONS.map((station) => {
                const copy = stations[station.key];
                return (
                  <div className={cx(STATION_CELL, station.shell)} key={station.key}>
                    {/* Station telemetry header (pen Node id) */}
                    <p className="font-mono text-[10px] font-medium tracking-[0.7px] text-white/80">
                      {station.overline}
                    </p>
                    {/* Logo stage (pen height 52, opacity .95) */}
                    <div className="flex h-[52px] items-center opacity-95">
                      <Image
                        alt={`${station.logo.name} logo`}
                        className="h-auto w-auto max-w-full select-none"
                        height={station.logo.height}
                        loading="lazy"
                        src={station.logo.src}
                        width={station.logo.width}
                      />
                    </div>
                    {/* Model routing strip (pen lsH6d family) */}
                    <div className="flex h-9 items-center justify-between gap-2 border border-[#36321d] bg-[#14130c] px-2.5">
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
                    <div className="flex flex-col gap-1">
                      <h3 className="font-general text-[13px] leading-[1.35] font-bold tracking-[-0.1px] text-white">
                        {copy.title}
                      </h3>
                      <p className="font-general text-xs leading-[1.4] text-white/60">
                        {copy.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
