import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FC } from 'react';

const TestimonyCarousel = dynamic(() =>
  import('./ui/TestimonyCarousel').then((mod) => mod.TestimonyCarousel),
);

export const Testimonial: FC = () => {
  return (
    <section className="relative z-10 mb-20 flex flex-col gap-12 px-6 pt-20">
      <div className="flex flex-col gap-7">
        <div className="text-center">
          <Image src="/quote.svg" width={48} height={48} alt="" className="mx-auto mb-4" />
          <h2 className="font-general text-4xl font-bold">
            Read what clients & peers say about{' '}
            <span className="underline decoration-gold decoration-1 underline-offset-[5px]">
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
