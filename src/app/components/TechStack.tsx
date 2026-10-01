import dynamic from 'next/dynamic';
import type { FC } from 'react';
import type { Dictionary } from '@/app/libs/i18n/types';
import { SegmentedText } from './ui/SegmentedText';

const ToolsMarquee = dynamic(() => import('./ui/ToolsMarquee').then((mod) => mod.ToolsMarquee));

interface Props {
  dict: Dictionary;
}

export const TechStack: FC<Props> = ({ dict }) => {
  const { techStack } = dict;

  return (
    <section className="relative z-10 mb-20 py-20 lg:mb-[120px]">
      <div className="flex flex-col gap-4 px-6 text-center md:mx-auto md:max-w-2xl lg:max-w-4xl lg:gap-3 xl:max-w-7xl xl:px-18">
        <h2 className="font-bold font-general text-4xl">
          <SegmentedText segments={techStack.heading} />
        </h2>
        <p className="font-general leading-[1.4375]">
          <SegmentedText segments={techStack.subline} />
        </p>
      </div>

      <ToolsMarquee />
    </section>
  );
};
