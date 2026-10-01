import Image from 'next/image';
import type { FC } from 'react';
import type { Dictionary } from '@/app/libs/i18n/types';
import { SegmentedText } from './ui/SegmentedText';

interface Props {
  dict: Dictionary;
}

export const Portfolio: FC<Props> = ({ dict }) => {
  const { portfolio } = dict;
  return (
    <section className="relative z-10 mb-20 px-6 md:mx-auto md:max-w-2xl lg:mb-[120px] lg:max-w-4xl xl:max-w-7xl xl:px-18">
      <div className="grid grid-cols-1 grid-rows-7 gap-6 sm:max-lg:grid-cols-2 sm:max-lg:grid-rows-5 lg:grid-cols-5 lg:grid-rows-7 xl:grid-rows-9">
        <div className="h-[207px] content-center text-center sm:text-left lg:col-span-2 xl:h-[198px]">
          <h2 className="mb-4 font-bold font-general text-4xl">
            <SegmentedText segments={portfolio.heading} />
          </h2>
          <div className="font-general">
            <SegmentedText segments={portfolio.subline} />
          </div>
        </div>
        <div className="relative row-span-2 lg:col-span-3 lg:row-span-2 xl:row-span-3">
          <Image
            className="object-cover"
            src="/projects/car-transport.webp"
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 60vw"
            alt=""
          />
        </div>
        <div className="relative row-span-2 lg:col-span-2 lg:row-span-3 xl:row-span-4">
          <Image
            className="object-cover"
            src="/projects/voice-chat-tinder.webp"
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 40vw"
            alt=""
          />
        </div>
        <div className="relative row-span-1 sm:order-5 sm:col-span-2 sm:row-span-2 lg:col-span-5 lg:row-span-3 xl:row-span-5">
          <Image
            className="object-cover"
            src="/projects/social-events.webp"
            fill
            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 624px, (max-width: 1279px) 848px, 1208px"
            alt=""
          />
        </div>
        <div className="relative sm:order-4 lg:col-span-3 lg:row-span-2">
          <Image
            className="object-cover"
            src="/projects/hr-portal.webp"
            fill
            sizes="(max-width: 1023px) 100vw, 60vw"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};
