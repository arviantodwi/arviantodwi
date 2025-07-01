'use client';

import { TECH_STACK } from '@/app/libs/constants';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

export const ToolsMarquee = () => {
  const stackMiddleIndex = Math.ceil(TECH_STACK.length / 2);
  const topRowStack = TECH_STACK.slice(0, stackMiddleIndex);
  const bottomRowStack = TECH_STACK.slice(stackMiddleIndex);

  return (
    <div className="flex flex-col gap-7 pt-12">
      <Marquee direction="left" gradient gradientColor="#040404" gradientWidth={24}>
        {topRowStack.map((item) => (
          <Image
            src={item.image}
            alt={`${item.name} logo`}
            height={48}
            width={0}
            className="mx-4 w-auto select-none"
            key={item.name}
            loading="eager"
          />
        ))}
      </Marquee>

      <Marquee direction="right" gradient gradientColor="#040404" gradientWidth={24}>
        {bottomRowStack.map((item) => (
          <Image
            src={item.image}
            alt={`${item.name} logo`}
            height={48}
            width={0}
            className="mx-4 w-auto select-none"
            key={item.name}
            loading="eager"
          />
        ))}
      </Marquee>
    </div>
  );
};
