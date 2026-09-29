'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import { Swiper, type SwiperClass, SwiperSlide } from 'swiper/react';
import type { PersonTestimony } from '@/app/libs/i18n/types';
import { SegmentedText } from './SegmentedText';

import 'swiper/css';

interface Props {
  testimonies: PersonTestimony[];
}

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
      <p className="text-center font-general font-light lg:text-[18px]">
        &quot;
        <SegmentedText segments={testimonies[activeTestimony].quotes} />
        &quot;
      </p>

      <div className="flex flex-col gap-6">
        <div className="relative sm:mx-auto sm:w-[330px]">
          {showLeftNavigator && (
            <PiCaretLeftBold
              className="absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer text-2xl opacity-66 xl:-left-8"
              role="button"
              onClick={handleNavigatePrev}
            />
          )}
          {showRightNavigator && (
            <PiCaretRightBold
              className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer text-2xl opacity-66 xl:-right-8"
              role="button"
              onClick={handleNavigateNext}
            />
          )}

          <Swiper
            spaceBetween={32}
            slidesPerView={3}
            centeredSlides
            centerInsufficientSlides
            className="people-carousel h-[80px] w-[256px] cursor-grab select-none active:cursor-grabbing xl:w-[336px]"
            initialSlide={activeTestimony}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
            breakpoints={{
              1280: {
                spaceBetween: 32,
              },
            }}
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

        <div className="text-center font-general">
          <div className="mb-2 font-medium text-xl opacity-75">
            {testimonies[activeTestimony].name}
          </div>
          <div className="opacity-60">{testimonies[activeTestimony].title}</div>
        </div>
      </div>
    </div>
  );
};
