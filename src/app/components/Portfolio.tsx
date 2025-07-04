import Image from 'next/image';
import { FC } from 'react';

export const Portfolio: FC = () => {
  return (
    <section className="relative z-10 mb-20 px-6">
      <div className="grid grid-cols-1 grid-rows-8 gap-6 md:grid-cols-3 md:grid-rows-3">
        <div className="h-[207px] content-center text-center md:order-2 md:h-[290px]">
          <h2 className="mb-4 font-general text-4xl font-bold">
            Take a look at my{' '}
            <span className="underline decoration-gold decoration-1 underline-offset-[5px]">
              past projects!
            </span>
          </h2>
          <div className="font-general">
            <span className="opacity-75">Selected amidst</span>{' '}
            <span className="font-medium text-gold">100+ projects</span>{' '}
            <span className="opacity-75">delivered!</span>
          </div>
        </div>
        <div className="relative row-span-2 md:order-1 md:row-span-1">
          <Image
            src="/projects/car-transport.webp"
            objectFit="cover"
            objectPosition="center"
            fill
            alt=""
          />
        </div>
        <div className="relative row-span-3 md:order-3 md:row-span-2">
          <Image
            src="/projects/voice-chat-tinder.webp"
            objectFit="cover"
            objectPosition="center"
            fill
            alt=""
          />
        </div>
        <div className="relative row-span-1 md:order-4 md:col-span-2 md:row-span-2">
          <Image
            src="/projects/social-events.webp"
            objectFit="cover"
            objectPosition="center"
            fill
            alt=""
          />
        </div>
        <div className="relative md:order-5 md:col-start-3 md:row-start-3">
          <Image
            src="/projects/hr-portal.webp"
            objectFit="cover"
            objectPosition="center"
            fill
            alt=""
          />
        </div>
      </div>
    </section>
  );
};
