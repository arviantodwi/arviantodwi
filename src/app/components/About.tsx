import type { FC } from 'react';
import { TbArrowUpRight } from 'react-icons/tb';
import type { Dictionary } from '@/app/lib/i18n/types';
import { CV_URL } from '../lib/constants';
import { Button } from './ui/Button';
import { Section } from './ui/Section';
import { SegmentedText } from './ui/SegmentedText';

interface Props {
  dict: Dictionary;
}

export const About: FC<Props> = ({ dict }) => {
  const { about } = dict;

  return (
    <Section id="about">
      <article className="font-general flex flex-col gap-10 xl:flex-row xl:gap-[72px]">
        <div className="about-box-accent relative max-w-fit pt-[51px] text-4xl font-bold lg:text-[40px] xl:shrink-0">
          <div aria-hidden="true" className="about-row-blur about-row-blur--left-row1" />
          <div aria-hidden="true" className="about-row-blur about-row-blur--left-row2" />
          <div aria-hidden="true" className="about-row-blur about-row-blur--right-row2" />
          <p className="relative z-[2]">{about.headline[0]}</p>
          <p className="relative z-[2]">{about.headline[1]}</p>
        </div>
        <div className="leading-[1.4375]">
          {about.bio.map((paragraph) => (
            <p
              key={paragraph[0].text}
              className={paragraph !== about.bio.at(-1) ? 'mb-[23px]' : undefined}
            >
              <SegmentedText segments={paragraph} />
            </p>
          ))}
          <div className="mt-8 flex justify-center sm:justify-start">
            <Button href={CV_URL} target="_blank" rel="noopener noreferrer" size="lg">
              {about.cta}
              <TbArrowUpRight size={18} />
            </Button>
          </div>
        </div>
      </article>
    </Section>
  );
};
