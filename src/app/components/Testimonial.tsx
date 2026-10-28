import dynamic from 'next/dynamic';
import type { FC } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { IconQuote } from './ui/icons';
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
    <Section id="testimonials" className="flex flex-col gap-12 pt-20 lg:pt-0">
      {/* Figma: heading centered, hr 1000px wide, quote 966px — all inside the 1200 container. */}
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-7">
        <div className="text-center">
          {/* Pen: flag node r910O — lucide quote glyph, 48px, $brand gold. */}
          <IconQuote size={48} className="text-gold mx-auto mb-4" />
          <h2 className="font-general text-4xl font-bold">
            <SegmentedText segments={testimonial.heading} />
          </h2>
        </div>

        <hr className="opacity-[0.125]" />

        <TestimonyCarousel testimonies={testimonial.testimonies} />
      </div>
    </Section>
  );
};
