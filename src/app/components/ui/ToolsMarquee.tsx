'use client';

import Marquee from 'react-fast-marquee';
import { TECH_STACK } from '@/app/libs/constants';

export const ToolsMarquee = () => {
  const stackMiddleIndex = Math.ceil(TECH_STACK.length / 2);
  const topRowStack = TECH_STACK.slice(0, stackMiddleIndex);
  const bottomRowStack = TECH_STACK.slice(stackMiddleIndex);

  return (
    <div className="flex flex-col gap-7 pt-12 md:mx-auto md:max-w-3xl lg:max-w-5xl lg:pt-20 xl:max-w-6xl">
      <Marquee direction="right" gradient gradientColor="#040404" gradientWidth={24}>
        {topRowStack.map((item) => (
          <img
            src={item.image}
            alt={`${item.name} logo`}
            className="mx-4 h-12 w-auto select-none"
            key={item.name}
            loading="eager"
            draggable={false}
          />
        ))}
      </Marquee>

      <Marquee direction="left" gradient gradientColor="#040404" gradientWidth={24}>
        {bottomRowStack.map((item) => (
          <img
            src={item.image}
            alt={`${item.name} logo`}
            className="mx-4 h-12 w-auto select-none"
            key={item.name}
            loading="eager"
            draggable={false}
          />
        ))}
      </Marquee>
    </div>
  );
};
