import Image from 'next/image';
import { FC } from 'react';
import { AvailabilityStatus, Status } from './ui/AvailabilityStatus';
import { SocialNav } from './ui/SocialNav';

export const Header: FC = () => {
  return (
    <header className="sticky top-0 z-20 h-[92px] p-6 backdrop-blur-md md:h-[100px] md:px-12 xl:h-[108px] xl:px-0">
      <div className="flex h-full items-center justify-between md:mx-auto md:max-w-2xl md:px-6 lg:max-w-4xl xl:max-w-7xl xl:px-18">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" width={133} height={36} alt="logo" />
          <SocialNav className="hidden sm:flex" />
        </div>
        <AvailabilityStatus variant={Status.AVAILABLE} />
      </div>
    </header>
  );
};
