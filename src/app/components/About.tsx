import type { FC } from 'react';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { cx } from '@/app/lib/utils';
import { CV_URL } from '../lib/constants';
import { Button } from './ui/Button';
import { IconArrowUpRight } from './ui/icons';
import { Section } from './ui/Section';
import { SegmentedText } from './ui/SegmentedText';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export const About: FC<Props> = ({ locale, dict }) => {
  const { about } = dict;

  /* Joint below lg: pure body/group gap (72 at uSM, 40 from sm) plus the
     sm:max-lg:mt-6 tier (24px at sm/md); 88px stats→heading at uSM since
     the hero carries pb-12. No negative margins — the photo runs behind
     the About since the hero no longer clips it. */
  return (
    <Section id="about" className="sm:max-lg:mt-6">
      <article className="font-general flex flex-col gap-10 max-sm:gap-6 lg:flex-row lg:gap-[72px]">
        <div className="about-box-accent relative max-w-fit pt-[51px] text-4xl font-bold max-sm:pt-[38px] max-sm:leading-[1.25] max-sm:tracking-[0.4px] lg:shrink-0 lg:text-[40px]">
          <div aria-hidden="true" className="about-row-blur about-row-blur--left-row1" />
          <div aria-hidden="true" className="about-row-blur about-row-blur--left-row2" />
          {/* Right-border strip: shown for EN at uSM/SM/MD, hidden below lg
              for ID (max-lg:hidden), lg+ visible for both locales. */}
          <div
            aria-hidden="true"
            className={cx(
              'about-row-blur about-row-blur--right-row2',
              locale === 'id' && 'max-lg:hidden',
            )}
          />
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
          {/* Pen uSM: centered below sm, left-aligned elsewhere. */}
          <div className="mt-8 flex justify-start max-sm:justify-center">
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
