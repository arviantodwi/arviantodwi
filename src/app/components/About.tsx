import type { FC } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { CV_URL } from '../lib/constants';
import { Button } from './ui/Button';
import { IconArrowUpRight } from './ui/icons';
import { Section } from './ui/Section';
import { SegmentedText } from './ui/SegmentedText';

interface Props {
  dict: Dictionary;
}

export const About: FC<Props> = ({ dict }) => {
  const { about } = dict;

  /* Joint below lg: body gap is 40; pen Hero→About internal gap is
     64 at sm/md (40 at uSM → no extra). No negative margins — the photo
     runs behind the About since the hero no longer clips it. */
  return (
    <Section id="about" className="sm:max-lg:mt-6">
      <article className="font-general flex flex-col gap-10 lg:flex-row lg:gap-[72px]">
        <div className="about-box-accent relative max-w-fit pt-[51px] text-4xl font-bold lg:shrink-0 lg:text-[40px]">
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
          {/* Pen uSM: left-aligned at every below-lg width. */}
          <div className="mt-8 flex justify-start">
            <Button href={CV_URL} target="_blank" rel="noopener noreferrer" size="lg">
              {about.cta}
              <IconArrowUpRight size={18} />
            </Button>
          </div>
        </div>
      </article>
    </Section>
  );
};
