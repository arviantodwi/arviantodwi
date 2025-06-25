'use client';

import { TECH_STACK } from '@/app/libs/constants';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

export const ToolsMarquee = () => {
  return (
    <div className="flex flex-col gap-7 pt-12">
      <Marquee direction="left" gradient gradientColor="#040404" gradientWidth={24}>
        {TECH_STACK.map((item) => (
          <Image
            src={item.image}
            alt={`${item.name} logo`}
            height={48}
            width={0}
            className="mx-4 w-auto"
            key={item.name}
            loading="eager"
          />
        ))}
      </Marquee>

      <Marquee direction="right" gradient gradientColor="#040404" gradientWidth={24}>
        {TECH_STACK.map((item) => (
          <Image
            src={item.image}
            alt={`${item.name} logo`}
            height={48}
            width={0}
            className="mx-4 w-auto"
            key={item.name}
            loading="eager"
          />
        ))}
      </Marquee>
    </div>
  );
};
