import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { FC, ReactNode } from 'react';
import type { Dictionary } from '@/app/lib/i18n/types';
import { HydrateInView } from './ui/HydrateInView';
import { IconQuote } from './ui/icons';
import { Section } from './ui/Section';
import { SegmentedText } from './ui/SegmentedText';

const TestimonyCarousel = dynamic(() =>
  import('./ui/TestimonyCarousel').then((mod) => mod.TestimonyCarousel),
);

/**
 * Static stand-in for the deferred carousel: the resting state is quote #1
 * over the centered first avatar — identical to the hydrated bounds, so the
 * swap never shifts layout. 2026-11-02 mobile-load fix: Swiper hydration
 * waits until this section nears the viewport (see ui/HydrateInView).
 */
function CarouselFallback({
  testimonies,
}: {
  testimonies: Dictionary['testimonial']['testimonies'];
}) {
  const first = testimonies[0];
  return (
    <div className="flex flex-col gap-12">
      <p className="font-general text-center font-light lg:text-[18px]">
        &quot;
        <SegmentedText segments={first.quotes} />
        &quot;
      </p>
      <div className="mx-auto h-20 w-[250px] lg:w-[336px] [&>img]:mx-auto">
        <Image
          className="size-20 rounded-full"
          src={first.photo}
          width={80}
          height={80}
          alt={`${first.name}'s photo`}
        />
      </div>
    </div>
  );
}

export const Testimonial: FC<{ dict: Dictionary }> = ({ dict }) => {
  const { testimonial } = dict;

  const carousel: ReactNode = (
    <HydrateInView fallback={<CarouselFallback testimonies={testimonial.testimonies} />}>
      <TestimonyCarousel testimonies={testimonial.testimonies} />
    </HydrateInView>
  );

  return (
    <Section
      id="testimonials"
      className="flex flex-col gap-12 [contain-intrinsic-size:auto_800px] [content-visibility:auto] lg:gap-16"
    >
      {/* Pen: heading centered, hr 1000px wide, quote 966px — all inside the 1200 container. */}
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-7">
        <div className="text-center">
          {/* Pen: flag node r910O — lucide quote glyph, 48px, $brand gold. */}
          <IconQuote size={48} className="text-gold mx-auto mb-4" />
          <h2 className="font-general text-4xl font-bold">
            <SegmentedText segments={testimonial.heading} />
          </h2>
        </div>

        <hr className="opacity-[0.125]" />

        {carousel}
      </div>
    </Section>
  );
};
