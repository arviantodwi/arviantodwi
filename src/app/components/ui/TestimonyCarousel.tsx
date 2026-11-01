'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { Swiper, type SwiperClass, SwiperSlide } from 'swiper/react';
import type { PersonTestimony } from '@/app/lib/i18n/types';
import { IconCaretLeft, IconCaretRight } from './icons';
import { SegmentedText } from './SegmentedText';

import 'swiper/css';

interface Props {
  testimonies: PersonTestimony[];
}

/**
 * Testimonial carousel — Swiper at EVERY width (owner: sliding is an
 * already-shipped feature; the pen row is only a dimension reference).
 *
 * Pen row geometry (nodes DeXtI @SM 330 / Jm6Lx @XL 464): carets at the
 * row edges (24px glyphs), 80px center avatar, 48px dimmed side avatars,
 * caret→side gap 16px below lg / 40px at lg+, side→center 101px/144px.
 * Implementation: a relative wrapper (fit-width / 464px at lg) with
 * absolutely placed caret buttons and a centered Swiper box — 250px
 * below lg, 336px at lg. Slides are fixed at 80px (globals.css) and the
 * neighbors' photos scale 0.6 → the pen's 48px dimmed circles; the
 * spaceBetween values (21/64) land the avatar centers exactly on the pen
 * numbers. Boundary carets stay hidden per the shipped behavior.
 */
export const TestimonyCarousel = ({ testimonies }: Props) => {
  const swiperRef = useRef<SwiperClass>(null);

  const [activeTestimony, setActiveTestimony] = useState<number>(0);

  const showLeftNavigator = useMemo(() => {
    return activeTestimony > 0;
  }, [activeTestimony]);

  const showRightNavigator = useMemo(() => {
    return activeTestimony < testimonies.length - 1;
  }, [activeTestimony, testimonies.length]);

  function handleSlideChange(swiper: SwiperClass) {
    setActiveTestimony(swiper.activeIndex);
  }

  function handleNavigatePrev() {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  }

  function handleNavigateNext() {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }

  return (
    <div className="flex flex-col gap-12">
      <p className="font-general text-center font-light lg:text-[18px]">
        &quot;
        <SegmentedText segments={testimonies[activeTestimony].quotes} />
        &quot;
      </p>

      <div className="flex flex-col gap-6">
        {/* Carousel row: carets pinned to the wrapper edges, the Swiper
            box slides between them (pen caret gaps: 16 below lg, 40 at lg). */}
        <div className="relative mx-auto flex h-20 w-[330px] max-w-full items-center lg:w-[464px]">
          <button
            type="button"
            aria-label="Previous testimony"
            onClick={handleNavigatePrev}
            aria-hidden={!showLeftNavigator}
            tabIndex={showLeftNavigator ? undefined : -1}
            className={`absolute top-1/2 left-0 z-1 -translate-y-1/2 cursor-pointer text-white opacity-66 transition-opacity hover:opacity-100 ${showLeftNavigator ? '' : 'invisible'}`}
          >
            <IconCaretLeft />
          </button>
          <button
            type="button"
            aria-label="Next testimony"
            onClick={handleNavigateNext}
            aria-hidden={!showRightNavigator}
            tabIndex={showRightNavigator ? undefined : -1}
            className={`absolute top-1/2 right-0 z-1 -translate-y-1/2 cursor-pointer text-white opacity-66 transition-opacity hover:opacity-100 ${showRightNavigator ? '' : 'invisible'}`}
          >
            <IconCaretRight />
          </button>

          <Swiper
            slidesPerView="auto"
            centeredSlides
            centerInsufficientSlides
            spaceBetween={21}
            breakpoints={{
              1024: {
                spaceBetween: 64,
              },
            }}
            className="people-carousel mx-auto h-20 w-[250px] cursor-grab select-none active:cursor-grabbing lg:w-[336px]"
            initialSlide={activeTestimony}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
          >
            {testimonies.map(({ name, photo }) => (
              <SwiperSlide key={name}>
                <Image
                  className="mx-auto rounded-full"
                  src={photo}
                  width={80}
                  height={80}
                  alt={`${name}'s photo`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="font-general text-center">
          <div className="mb-2 text-xl font-medium opacity-75">
            {testimonies[activeTestimony].name}
          </div>
          <div className="opacity-60">{testimonies[activeTestimony].title}</div>
        </div>
      </div>
    </div>
  );
};
