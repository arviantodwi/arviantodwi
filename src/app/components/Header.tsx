import Image from 'next/image';
import type { FC } from 'react';
import type { Dictionary, Locale } from '@/app/libs/i18n/types';
import { AvailabilityStatus, Status } from './ui/AvailabilityStatus';
import { LangSwitcher } from './ui/LangSwitcher';
import { SocialNav } from './ui/SocialNav';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export const Header: FC<Props> = ({ dict, locale }) => {
  return (
    <header className="sticky top-0 z-20 h-[92px] p-6 backdrop-blur-md md:h-[100px] md:px-12 xl:h-[108px] xl:px-0">
      <div className="flex h-full items-center justify-between md:mx-auto md:max-w-2xl md:px-6 lg:max-w-4xl xl:max-w-7xl xl:px-18">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" width={133} height={36} alt="logo" />
          <SocialNav className="hidden sm:flex" />
        </div>
        <div className="flex items-center gap-5">
          <AvailabilityStatus variant={Status.AVAILABLE} labels={dict.header.status} />
          <span aria-hidden="true" className="hidden h-4 w-px bg-white/15 sm:block" />

          <LangSwitcher className="hidden sm:block" locale={locale} />
        </div>
      </div>
    </header>
  );
};
