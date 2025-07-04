'use client';

import { TypeAnimation } from 'react-type-animation';

export const ClientTypeAnimation = () => (
  <TypeAnimation
    cursor={false}
    preRenderFirstString={true}
    repeat={Infinity}
    sequence={[1000, 'TypeScript Enthusiast', 1000, 'Wizard of Screens', 1000, 'Crypto Day-Trader', 1000, 'Humorous Dad']}
    speed={50}
    deletionSpeed={75}
    className='border-b-[1px] border-b-gold'
  />
);
