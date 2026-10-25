import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { FC } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { Section } from './ui/Section';
import { SegmentedText } from './ui/SegmentedText';

const TestimonyCarousel = dynamic(() =>
  import('./ui/TestimonyCarousel').then((mod) => mod.TestimonyCarousel),
);

interface Props {
  dict: Dictionary;
}

export const Testimonial: FC<Props> = ({ dict }) => {
  const { testimonial } = dict;

  return (
    <Section id="testimonials" className="flex flex-col gap-12 pt-20">
      {/* Figma: heading centered, hr 1000px wide, quote 966px — all inside the 1200 container. */}
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-7">
        <div className="text-center">
          <Image src="/quote.svg" width={48} height={48} alt="" className="mx-auto mb-4" />
          <h2 className="font-bold font-general text-4xl">
            <SegmentedText segments={testimonial.heading} />
          </h2>
        </div>

        <hr className="opacity-[0.125]" />

        <TestimonyCarousel testimonies={testimonial.testimonies} />
      </div>
    </Section>
  );
};
