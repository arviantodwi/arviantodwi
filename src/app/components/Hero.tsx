import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { FC } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { AvailabilityStatus, Status } from './ui/AvailabilityStatus';
import { Section } from './ui/Section';

const TypeAnimation = dynamic(() =>
  import('./ui/TypeAnimation').then((mod) => mod.ClientTypeAnimation),
);
const Statistic = dynamic(() => import('./ui/Statistic').then((mod) => mod.Statistic));

interface Props {
  dict: Dictionary;
}

/** Statistic label with small/large variants (mirrors the original breakpoint tricks). */
const statText = (label: { short: string; long: string }) => (
  <>
    <span className="lg:hidden">{label.short}</span>
    <span className="hidden lg:inline-block">{label.long}</span>
  </>
);

export const Hero: FC<Props> = ({ dict }) => {
  const { hero } = dict;

  return (
    <Section className="relative overflow-hidden pt-6 pb-0 min-[600px]:overflow-visible min-[1440px]:gap-[200px] sm:pt-8 md:pt-12 lg:h-[640px] lg:pt-0 xl:flex xl:h-[700px] xl:items-start xl:justify-between xl:gap-8">
      {/* Copy column: headline block + stats, vertically centered against
          the photo at lg/xl (pen "Hero Copy": 478px, centered, gap 56;
          lg hero box 640, xl 700). */}
      <div className="flex flex-col gap-12 lg:h-[640px] lg:w-[478px] lg:shrink-0 lg:justify-center lg:gap-14 xl:h-full">
        <div className="flex flex-col gap-6 sm:max-w-3/4">
          {/* Mobile: the topbar has no room for the status pill, so it
              anchors above the name (sm+ keeps it in the topbar). Variant
              must stay in sync with Header. */}
          <AvailabilityStatus
            variant={Status.UNAVAILABLE}
            labels={dict.header.status}
            className="-mb-4 sm:hidden"
          />
          <h1 className="sm:w-[333px] lg:w-[478px]">
            <span className="font-headline text-[76px] leading-[1.0657894737] font-bold text-white uppercase lg:text-[112px]">
              Arvianto
            </span>{' '}
            <span className="font-headline text-gold text-[76px] leading-[1.0657894737] font-bold uppercase lg:text-[112px]">
              Wicaksono
            </span>
          </h1>
          <div className="font-general flex flex-col gap-2 text-white lg:text-[20px]">
            <div className="font-medium text-nowrap">
              <span className="opacity-75">{hero.rolePrefix}</span>{' '}
              <TypeAnimation roles={hero.roles} />
            </div>
            <div className="font-normal opacity-60">{hero.location}</div>
          </div>
        </div>

        {/* 3 stats at every width (pen: they fit 375px — 263px + gaps;
            wrap only below 375). Row gap 20 at lg, 32 elsewhere (pen). */}
        <div className="flex flex-wrap items-start gap-8 lg:gap-5 xl:gap-8">
          <Statistic
            text={statText(hero.stats.projects)}
            value={128}
            className="max-w-[93px] shrink-0 lg:max-w-[120px]"
          />
          <Statistic
            text={statText(hero.stats.tools)}
            value={32}
            className="max-w-[85px] shrink-0 lg:max-w-[122px]"
          />
          <Statistic
            text={statText(hero.stats.years)}
            value={12}
            className="max-w-[85px] shrink-0 lg:max-w-[150px]"
          />
        </div>
      </div>

      {/* Photo: absolute below lg. Base (375–599): horizontally centered on
          the viewport, top 116px, behind the name/role at 0.33 — clipped to
          the hero box (pen Hero frame clip). From 600px it flips to the sm
          placement (content x 286 → viewport 318, top 11) at full opacity
          and the clip becomes horizontal-only, letting the photo run past
          the hero bottom behind the About (pen @SM/@MD) and bleed off the
          right viewport edge. At md it shifts right (viewport 415, top 25,
          84px right bleed). At lg: 484px wide, flush to the viewport right,
          top 0 — 726px tall, overflowing ~86px past the 640px hero into the
          About gap. From xl the positioned, in-flow wrapper contains Image
          fill and shrinks with the row (min 32px gap); from 1440px it keeps
          the artboard's fixed 584×877 (D9 pen-exact row, gap 200). */}
      {/* Photo: absolute below lg. Base (375–599): horizontally centered on
          the viewport, top 116px, behind the name/role at 0.33 — clipped to
          the hero box (pen Hero frame clip). From 600px it flips to full
          opacity, the box opens (photo runs past the hero bottom behind the
          About) and the photo bleeds 115px off the right viewport edge —
          traveling with the resize ONLY until 672px (owner rule): after that
          it freezes at viewport x 350 (the exact position it carries at
          672; the sm shell spans the viewport, so left-in-element =
          left-in-document). From md that same `left-[350px]` keeps the
          freeze at the 768 boundary (owner: no jump; the pen @MD x415/y25
          is waived) and the photo then rides the capped container as the
          margins grow, fading the bleed out. The root overflow-x clip rules
          the horizontal bleed and the scroll ban.
          At lg: 484px wide, flush to the container right at top 0 — 726px
          tall, overflowing ~86px past the 640px hero into the About gap.
          From xl the positioned, in-flow wrapper contains Image fill and
          shrinks with the row (min 32px gap); from 1440px it keeps the
          artboard's fixed 584×877 (D9 pen-exact row, gap 200). */}
      <div className="absolute top-[116px] left-1/2 -z-10 aspect-[584/877] w-[437px] -translate-x-1/2 opacity-[0.33] min-[600px]:left-auto min-[600px]:translate-x-0 min-[600px]:opacity-100 min-[600px]:max-[672px]:top-[11px] min-[600px]:max-[672px]:right-[-115px] min-[672px]:max-md:top-[11px] min-[672px]:max-md:right-auto min-[672px]:max-md:left-[350px] md:max-lg:top-[11px] md:max-lg:left-[350px] lg:top-0 lg:right-0 lg:w-[484px] xl:relative xl:inset-auto xl:w-[584px] xl:min-w-0">
        <Image
          src="/photo.png"
          fill
          priority
          sizes="(min-width: 1280px) 584px, (min-width: 1024px) 484px, 437px"
          alt={hero.photoAlt}
          className="object-contain"
        />
      </div>
    </Section>
  );
};
