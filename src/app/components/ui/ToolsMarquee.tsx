import { TECH_STACK } from '@/app/lib/constants';

/**
 * Server component: no 'use client', no hydration, no per-frame JS.
 *
 * The 2026-11-02 mobile-load fix replaced react-fast-marquee (a client RAF
 * loop with a duplicated iframe-like track) with a pure CSS transform
 * loop — GPU-composited, seamless, and free on weak devices (the iPhone 11
 * Pro field data showed JS marquee work dominating the main thread).
 *
 * Full bleed below lg — `mx-[calc(50% - 50vw)]` resolves to exactly the
 * negative tier gutter against the section content (works for the fluid
 * base/sm shells AND the capped md shell); from lg the marquee spans the
 * section content width (896 fixed, 1200 fixed). Top gap follows the
 * block-pad scale, with the 2026-11-02 uSM adjustment: heading → rows is
 * 48 under sm (pen @under-SM wrapper gap), 32 from sm, 48 from md. Rows
 * fade with a CSS mask — a solid paint-over would dark-patch the glow
 * behind the rows; a mask fades the row pixels themselves and lets the
 * real background show through.
 */
export const ToolsMarquee = () => {
  const stackMiddleIndex = Math.ceil(TECH_STACK.length / 2);
  const topRowStack = TECH_STACK.slice(0, stackMiddleIndex);
  const bottomRowStack = TECH_STACK.slice(stackMiddleIndex);

  /* Row 1 runs leftward, row 2 rightward (reversed), matching the shipped
     react-fast-marquee `direction` pairing. Each row renders its stack
     twice; `marquee-slide` moves the track exactly one duplicate (-50%),
     so the loop is seamless. */
  const renderRow = (row: typeof TECH_STACK, reversed: boolean) => (
    <div className="marquee-row overflow-hidden" data-reverse={reversed ? 'true' : undefined}>
      <div className="marquee-track">
        {/* Row renders twice ({[...row, ...row]}) for the -50% loop — name
            alone isn't a key (collides across the copies); add the copy
            index. List is static, so copy index stays stable. */}
        {[...row, ...row].map((item, i) => (
          <img
            src={item.image}
            alt={`${item.name} logo`}
            className="mx-4 h-11 w-auto select-none max-sm:h-9 lg:h-12"
            key={`${item.name}-${i < row.length ? 1 : 2}`}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="tools-marquee-mask mx-[calc(50%_-_50vw)] flex flex-col gap-7 pt-12 sm:pt-8 md:pt-12 lg:mx-0 lg:gap-8 lg:pt-16 xl:pt-20">
      {renderRow(topRowStack, false)}
      {renderRow(bottomRowStack, true)}
    </div>
  );
};
