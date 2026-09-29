import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { FC } from 'react';

const TestimonyCarousel = dynamic(() =>
  import('./ui/TestimonyCarousel').then((mod) => mod.TestimonyCarousel),
);

export const Testimonial: FC = () => {
  return (
    <section className="relative z-10 mb-20 flex flex-col gap-12 px-6 pt-20 md:mx-auto md:max-w-2xl xl:max-w-5xl xl:px-18">
      <div className="flex flex-col gap-7">
        <div className="text-center">
          <Image src="/quote.svg" width={48} height={48} alt="" className="mx-auto mb-4" />
          <h2 className="font-bold font-general text-4xl">
            Read what clients & peers say about{' '}
            <span className="underline decoration-1 decoration-gold underline-offset-[5px]">
              my work!
            </span>
          </h2>
        </div>

        <hr className="opacity-[0.125]" />

        <TestimonyCarousel />
      </div>
    </section>
  );
};
