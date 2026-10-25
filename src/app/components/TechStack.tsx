import dynamic from 'next/dynamic';
import type { FC } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { Section } from './ui/Section';
import { SegmentedText } from './ui/SegmentedText';

const ToolsMarquee = dynamic(() => import('./ui/ToolsMarquee').then((mod) => mod.ToolsMarquee));

interface Props {
  dict: Dictionary;
}

export const TechStack: FC<Props> = ({ dict }) => {
  const { techStack } = dict;

  return (
    <Section className="py-20">
      <Section as="div" className="flex flex-col gap-4 text-center lg:gap-3">
        <h2 className="font-general text-4xl font-bold">
          <SegmentedText segments={techStack.heading} />
        </h2>
        <p className="font-general leading-[1.4375]">
          <SegmentedText segments={techStack.subline} />
        </p>
      </Section>

      <ToolsMarquee />
    </Section>
  );
};
