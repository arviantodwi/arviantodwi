import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { FC } from 'react';
import type { Dictionary } from '@/app/libs/i18n/types';
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
    <section className="relative z-10 mb-20 flex flex-col gap-12 px-6 pt-20 md:mx-auto md:max-w-2xl xl:max-w-5xl xl:px-18">
      <div className="flex flex-col gap-7">
        <div className="text-center">
          <Image src="/quote.svg" width={48} height={48} alt="" className="mx-auto mb-4" />
          <h2 className="font-bold font-general text-4xl">
            <SegmentedText segments={testimonial.heading} />
          </h2>
        </div>

        <hr className="opacity-[0.125]" />

        <TestimonyCarousel testimonies={testimonial.testimonies} />
      </div>
    </section>
  );
};
