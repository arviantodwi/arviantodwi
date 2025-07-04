import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FC } from 'react';

const TypeAnimation = dynamic(() =>
  import('./ui/TypeAnimation').then((mod) => mod.ClientTypeAnimation),
);
const Statistic = dynamic(() => import('./ui/Statistic').then((mod) => mod.Statistic));

export const Hero: FC = () => {
  return (
    <section className="relative z-10 mb-20 overflow-hidden px-6 pt-6 pb-[656.234px] sm:pb-[256px] md:mx-auto md:max-w-2xl lg:max-w-4xl lg:pt-0 lg:pb-[177px] xl:max-w-7xl xl:px-18">
      <div className="flex flex-col gap-6 sm:max-w-3/4 lg:pt-[72px] xl:pt-[121px]">
        <h1 className="sm:w-[333px] lg:w-[400px]">
          <span className="font-headline text-[76px] leading-[1.0657894737] font-bold text-white uppercase lg:text-[116px]">
            Arvianto
          </span>{' '}
          <span className="font-headline text-[76px] leading-[1.0657894737] font-bold text-gold uppercase lg:text-[116px]">
            Wicaksono
          </span>
        </h1>
        <div className="flex flex-col gap-2 font-general text-white lg:text-[20px]">
          <div className="font-medium text-nowrap">
            <span className="opacity-75">Front End Developer &</span> <TypeAnimation />
          </div>
          <div className="font-normal opacity-60">Bandung, Indonesia</div>
        </div>
      </div>

      <div className="mt-12 flex items-start gap-8 lg:pb-[98px] xl:pb-[121px]">
        <Statistic text="Projects done" value={128} className="max-w-[93px] lg:max-w-[120px]" />
        <Statistic
          text={
            <>
              Dev<span className="hidden lg:inline-block">eloper</span> tools
            </>
          }
          value={32}
          className="max-w-[85px] lg:max-w-[122px]"
        />
        <Statistic
          text=<>
            Years of{' '}
            <span className="after:inline-block after:content-['.'] lg:after:hidden">
              exp<span className="hidden lg:inline-block">erience</span>
            </span>
          </>
          value={12}
          className="max-w-[85px] lg:max-w-[150px]"
        />
      </div>

      <div className="absolute bottom-0 left-1/2 aspect-[0.6659047619] w-[437px] -translate-x-1/2 sm:top-0 sm:bottom-auto sm:left-[286px] sm:-translate-x-0 lg:-right-24 lg:left-auto lg:w-[584px] xl:-right-12">
        <Image src="/photo.png" fill alt="Arvianto's photo" />
      </div>
    </section>
  );
};
