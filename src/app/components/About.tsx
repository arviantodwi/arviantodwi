import type { FC } from 'react';
import type { Dictionary } from '@/app/libs/i18n/types';
import { SegmentedText } from './ui/SegmentedText';

interface Props {
  dict: Dictionary;
}

export const About: FC<Props> = ({ dict }) => {
  const { about } = dict;

  return (
    <section className="relative z-10 -mt-[240px] mb-20 px-6 md:mx-auto md:max-w-2xl lg:mb-[120px] lg:max-w-4xl xl:-mt-[188px] xl:max-w-7xl xl:px-18">
      <article className="flex flex-col gap-10 font-general xl:flex-row xl:gap-[72px]">
        <div className="about-box-accent relative max-w-fit pt-[51px] font-bold text-4xl lg:text-[40px] xl:shrink-0">
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
        </div>
      </article>
    </section>
  );
};
