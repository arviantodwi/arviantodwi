import dynamic from 'next/dynamic';
import { FC } from 'react';

const ToolsMarquee = dynamic(() => import('./ui/ToolsMarquee').then((mod) => mod.ToolsMarquee));

export const TechStack: FC = () => {
  return (
    <section className="relative z-10 mb-20 py-20 lg:mb-[120px]">
      <div className="flex flex-col gap-4 px-6 text-center md:mx-auto md:max-w-2xl lg:max-w-4xl lg:gap-3 xl:max-w-7xl xl:px-18">
        <h2 className="font-general text-4xl font-bold">
          I build{' '}
          <span className="underline decoration-gold decoration-1 underline-offset-[5px]">
            awesome
          </span>{' '}
          experiences on the internet!
        </h2>
        <p className="font-general leading-[1.4375]">
          <span className="opacity-75">Minimalism will always be my core, and I leverage</span>{' '}
          <span className="text-gold">32+ tools</span>{' '}
          <span className="opacity-75">
            and technologies to achieve exceptional day-to-day results.
          </span>
        </p>
      </div>

      <ToolsMarquee />
    </section>
  );
};
