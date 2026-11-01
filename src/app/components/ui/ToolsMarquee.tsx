'use client';

import Marquee from 'react-fast-marquee';
import { TECH_STACK } from '@/app/lib/constants';

export const ToolsMarquee = () => {
  const stackMiddleIndex = Math.ceil(TECH_STACK.length / 2);
  const topRowStack = TECH_STACK.slice(0, stackMiddleIndex);
  const bottomRowStack = TECH_STACK.slice(stackMiddleIndex);

  /* Full bleed below lg — `mx-[calc(50% - 50vw)]` resolves to exactly the
     negative tier gutter against the section content (works for the fluid
     base/sm shells AND the capped md shell); from lg the marquee spans the
     section content width (896 fixed, 1200 fixed). Top gap follows the
     block-pad scale, with the 2026-11-02 uSM adjustment: heading → rows is
     48 under sm (pen @under-SM wrapper gap), 32 from sm, 48 from md. Rows
     fade with a CSS mask —
     react-fast-marquee's own `gradient` paints an opaque #040404 band that
     dark-patches the glow behind the rows; a mask fades the row pixels
     themselves and lets the real background show through. */
  return (
    <div className="tools-marquee-mask mx-[calc(50%_-_50vw)] flex flex-col gap-7 pt-12 sm:pt-8 md:pt-12 lg:mx-0 lg:gap-8 lg:pt-16 xl:pt-20">
      <Marquee direction="right">
        {topRowStack.map((item) => (
          <img
            src={item.image}
            alt={`${item.name} logo`}
            className="mx-4 h-11 w-auto select-none max-sm:h-9 lg:h-12"
            key={item.name}
            loading="eager"
            draggable={false}
          />
        ))}
      </Marquee>

      <Marquee direction="left">
        {bottomRowStack.map((item) => (
          <img
            src={item.image}
            alt={`${item.name} logo`}
            className="mx-4 h-11 w-auto select-none max-sm:h-9 lg:h-12"
            key={item.name}
            loading="eager"
            draggable={false}
          />
        ))}
      </Marquee>
    </div>
  );
};
