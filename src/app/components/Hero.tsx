import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { FC } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
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
    <Section className="relative overflow-hidden pt-6 pb-[656.234px] sm:pb-[256px] md:pt-0 lg:pb-[177px] xl:flex xl:h-[700px] xl:items-start xl:gap-[200px] xl:overflow-visible xl:pb-0">
      {/* Copy column: headline block + stats, vertically centered against
          the photo at xl (Figma "Hero Copy": 478px, centered, gap 56). */}
      <div className="flex flex-col gap-12 xl:h-full xl:w-[478px] xl:shrink-0 xl:justify-center xl:gap-14">
        <div className="flex flex-col gap-6 sm:max-w-3/4 lg:pt-[72px] xl:pt-0">
          <h1 className="sm:w-[333px] lg:w-[400px]">
            <span className="font-bold font-headline text-[76px] text-white uppercase leading-[1.0657894737] lg:text-[116px]">
              Arvianto
            </span>{' '}
            <span className="font-bold font-headline text-[76px] text-gold uppercase leading-[1.0657894737] lg:text-[116px]">
              Wicaksono
            </span>
          </h1>
          <div className="flex flex-col gap-2 font-general text-white lg:text-[20px]">
            <div className="text-nowrap font-medium">
              <span className="opacity-75">{hero.rolePrefix}</span>{' '}
              <TypeAnimation roles={hero.roles} />
            </div>
            <div className="font-normal opacity-60">{hero.location}</div>
          </div>
        </div>

        <div className="flex items-start gap-8 lg:pb-[98px] xl:pb-0">
          <Statistic
            text={statText(hero.stats.projects)}
            value={128}
            className="max-w-[93px] lg:max-w-[120px]"
          />
          <Statistic
            text={statText(hero.stats.tools)}
            value={32}
            className="max-w-[85px] lg:max-w-[122px]"
          />
          <Statistic
            text={statText(hero.stats.years)}
            value={12}
            className="max-w-[85px] lg:max-w-[150px]"
          />
        </div>
      </div>

      {/* Photo: absolute below xl (current responsive behavior); in-flow
          584×877 column at xl, hanging 177px below the 700px hero like the
          artboard. */}
      <div className="absolute bottom-0 left-1/2 aspect-[0.6659047619] w-[437px] -translate-x-1/2 sm:top-0 sm:bottom-auto sm:left-[286px] sm:-translate-x-0 lg:-right-24 lg:left-auto lg:w-[584px] xl:static xl:shrink-0">
        <Image
          src="/photo.png"
          fill
          priority
          sizes="(max-width: 1023px) 437px, 584px"
          alt={hero.photoAlt}
        />
      </div>
    </Section>
  );
};
