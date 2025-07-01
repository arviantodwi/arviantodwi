import Image from 'next/image';
import { FC } from 'react';
import { AvailabilityStatus, Status } from './ui/AvailabilityStatus';
import { SocialNav } from './ui/SocialNav';

export const Header: FC = () => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" width={133} height={36} alt="logo" />
        <SocialNav className="hidden sm:flex" />
      </div>
      <AvailabilityStatus variant={Status.AVAILABLE} />
    </header>
  );
};
