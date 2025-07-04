'use client';

import Image from 'next/image';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import 'swiper/css';

interface People {
  photo: string;
  name: string;
  role: string;
  org?: string;
}
interface Testimony extends People {
  testimony: ReactNode;
}
const testimony: Testimony[] = [
  {
    photo: '/people/profile_logo_24449541.jpg.webp',
    name: 'David Seek',
    org: 'Amazon',
    role: 'Senior SDE',
    testimony: (
      <>
        <span className="opacity-75">
          Arvi is the most talented designer I have ever seen. I have now worked with him on several
          projects and he
        </span>{' '}
        <b className="font-medium text-gold">
          constantly grows with the requirements. He has the eye for the detail and he is pixel
          perfect.
        </b>{' '}
        <span className="opacity-75">
          The UI is 50% of what makes an App great and Arvi is able to completely satisfy the need
          for an amazing UI.
        </span>
      </>
    ),
  },
  {
    photo: '/people/1744129672250.jpeg',
    name: 'Lucas Brancher',
    org: 'Automata Network',
    role: 'Core UI/UX Designer',
    testimony: (
      <>
        <b className="font-medium text-gold">
          Throughout the years, I had the pleasure of working with Arvianto,
        </b>{' '}
        <span className="opacity-75">
          and the joy of sharing my designs, ideas, and concepts with someone who really cared a lot
          about it all, always giving his best to achieve maximum quality of the final product!
        </span>
      </>
    ),
  },
  {
    photo: '/people/1516639420540.jpeg',
    name: 'Putra R. Mahardhika',
    role: 'Blockchain & Web3 Analyst',
    testimony: (
      <>
        <span className="opacity-75">Expert on UI/UX with well managed code. Work fast,</span>{' '}
        <b className="font-medium text-gold">
          listen well in the team and always has good ideas to improve the works.
        </b>
      </>
    ),
  },
  {
    photo: '/people/1624592440235.jpeg',
    name: 'Nasir Iqbal',
    org: 'ICT Innovations',
    role: 'System Engineer',
    testimony: (
      <>
        <span className="opacity-75">
          Exceptional! Creativity, design, vision or understanding Arvianto is outstanding in any
          way!
        </span>{' '}
        <b className="font-medium text-gold">I rate him as &quot;A Class&quot; developer.</b>{' '}
        <span className="opacity-75">
          Being a project manager I wish to have such a gem in my team. For quality work I highly
          recommend him.
        </span>
      </>
    ),
  },
  {
    photo: '/people/1656478335697.jpeg',
    name: 'Irsam S. Gana',
    org: 'Agronum Tech',
    role: 'Senior System Analyst',
    testimony: <span className="opacity-75">Interesting and eye catching UI design!</span>,
  },
  {
    photo: '/people/1740735553903.jpeg',
    name: 'Gustavo Costa',
    org: 'Clancys Sports',
    role: 'Senior Consultant',
    testimony: (
      <>
        <span className="opacity-75">Arvi is</span>{' '}
        <b className="font-medium text-gold">
          one of the best freelancers I have ever worked with.
        </b>{' '}
        <span className="opacity-75">
          He did an awesome job, as usual. Will keep working with him in my next projects.
        </span>
      </>
    ),
  },
  {
    photo: '/people/profile_logo_9172955.jpg.webp',
    name: 'Steven M. Carlson',
    org: 'AutoCorner',
    role: 'Co-Founder',
    testimony: (
      <>
        <span className="opacity-75">Amazing work. Great programmer.</span>{' '}
        <b className="font-medium text-gold">Very hard worker!</b>{' '}
        <span className="opacity-75">I WILL HIRE AGAIN!</span>
      </>
    ),
  },
  {
    photo: '/people/profile_logo_32764036.jpg.webp',
    name: 'Theo Hannisse',
    org: 'RLLY NaviGames',
    role: 'Founder',
    testimony: <span className="opacity-75">Great to work with. Creative worker.</span>,
  },
];

export const TestimonyCarousel = () => {
  const swiperRef = useRef<SwiperClass>(null);

  const [activeTestimony, setActiveTestimony] = useState<number>(0);

  const showLeftNavigator = useMemo(() => {
    return activeTestimony > 0;
  }, [activeTestimony]);

  const showRightNavigator = useMemo(() => {
    return activeTestimony < testimony.length - 1;
  }, [activeTestimony]);

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
      <p className="text-center font-general font-light">
        &quot;{testimony[activeTestimony].testimony}&quot;
      </p>

      <div className="flex flex-col gap-6">
        <div className="relative">
          {showLeftNavigator && (
            <PiCaretLeftBold
              className="absolute top-1/2 left-0 -translate-y-1/2 text-2xl opacity-66"
              role="button"
              onClick={handleNavigatePrev}
            />
          )}
          {showRightNavigator && (
            <PiCaretRightBold
              className="absolute top-1/2 right-0 -translate-y-1/2 text-2xl opacity-66"
              role="button"
              onClick={handleNavigateNext}
            />
          )}

          <Swiper
            spaceBetween={8}
            slidesPerView={3}
            centeredSlides
            centerInsufficientSlides
            className="people-carousel h-[80px] w-[256px]"
            initialSlide={activeTestimony}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
          >
            {testimony.map(({ name, photo }, i) => (
              <SwiperSlide key={`testimony-people-${i}`}>
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
          <div className="mb-2 text-xl font-medium opacity-75">
            {testimony[activeTestimony].name}
          </div>
          <div className="opacity-60">
            {testimony[activeTestimony].role}
            {testimony[activeTestimony].org && ` at ${testimony[activeTestimony].org}`}
          </div>
        </div>
      </div>
    </div>
  );
};
