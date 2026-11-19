'use client';

import { TypeAnimation } from 'react-type-animation';

interface Props {
  roles: string[];
}

export const ClientTypeAnimation = ({ roles }: Props) => (
  <TypeAnimation
    cursor={false}
    preRenderFirstString={true}
    repeat={Infinity}
    sequence={roles.flatMap((role) => [1000, role])}
    speed={50}
    deletionSpeed={75}
    className="border-b-[1px] border-b-gold"
  />
);
