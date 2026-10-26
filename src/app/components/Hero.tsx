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
    <Section className="relative overflow-hidden pt-6 pb-[280px] sm:pb-[256px] md:pt-0 lg:min-h-[728px] lg:pb-0 xl:flex xl:h-[700px] xl:min-h-0 xl:items-start xl:justify-between xl:gap-8 xl:overflow-visible 2xl:gap-[200px]">
      {/* Copy column: headline block + stats, vertically centered against
          the photo at xl (Figma "Hero Copy": 478px, centered, gap 56). */}
      <div className="flex flex-col gap-12 xl:h-full xl:w-[478px] xl:shrink-0 xl:justify-center xl:gap-14">
        <div className="flex flex-col gap-6 sm:max-w-3/4 lg:max-w-none lg:pt-[72px] xl:pt-0">
          {/* Mobile: the topbar has no room for the status pill, so it
              anchors above the name (sm+ keeps it in the topbar). Variant
              must stay in sync with Header. */}
          <AvailabilityStatus
            variant={Status.UNAVAILABLE}
            labels={dict.header.status}
            className="-mb-4 sm:hidden"
          />
          <h1 className="sm:w-[333px] lg:w-[440px] xl:w-[500px]">
            <span className="font-headline text-[76px] leading-[1.0657894737] font-bold text-white uppercase lg:text-[100px] xl:text-[116px]">
              Arvianto
            </span>{' '}
            <span className="font-headline text-gold text-[76px] leading-[1.0657894737] font-bold uppercase lg:text-[100px] xl:text-[116px]">
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

        {/* Wrap (not shrink) below sm: 3 stats fit 375px exactly; narrower
            viewports push the last one to its own line. sm+ never hits
            either condition, so the row renders as today. */}
        <div className="flex flex-wrap items-start gap-8">
          <Statistic
            text={statText(hero.stats.projects)}
            value={128}
            className="max-w-[93px] shrink-0 lg:max-w-[120px]"
          />
          {/* Mobile shows 2 stats (Projects + Years); Tools rejoins from 600px. */}
          <Statistic
            text={statText(hero.stats.tools)}
            value={32}
            className="hidden max-w-[85px] shrink-0 min-[600px]:flex lg:max-w-[122px]"
          />
          <Statistic
            text={statText(hero.stats.years)}
            value={12}
            className="max-w-[85px] shrink-0 lg:max-w-[150px]"
          />
        </div>
      </div>

      {/* Photo: absolute below xl — dimmed (0.33) backdrop at -z, hung off
          the right edge (right -10%, bottom -11%); from 600px only the
          position flips to the sm placement (top-0, left 286px, insets
          autoed) and opacity returns to 1 — it stays behind the copy
          (-z) at every absolute width. At md only, shift it up with the
          copy's removed 24px top padding to preserve the sm alignment.
          At lg, the 480px portrait fits inside a 728px hero. From xl the
          positioned, in-flow wrapper contains Image fill and can shrink
          with the row. At 2xl it keeps the artboard's 584×877 size and
          177px bottom overhang. */}
      <div className="absolute right-[-10%] bottom-[-11%] left-auto -z-10 aspect-[584/877] w-[437px] opacity-[0.33] min-[600px]:top-0 min-[600px]:right-auto min-[600px]:bottom-auto min-[600px]:left-[286px] min-[600px]:opacity-100 md:max-lg:-top-6 lg:right-0 lg:left-auto lg:w-[480px] xl:relative xl:inset-auto xl:w-[584px] xl:min-w-0 2xl:shrink-0">
        <Image
          src="/photo.png"
          fill
          priority
          sizes="(min-width: 1334px) 584px, (min-width: 1280px) calc(100vw - 750px), (min-width: 1024px) 480px, 437px"
          alt={hero.photoAlt}
          className="object-contain"
        />
      </div>
    </Section>
  );
};
