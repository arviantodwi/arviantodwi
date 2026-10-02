'use client';

import Image from 'next/image';
import { type FC, useEffect, useState } from 'react';
import type { Dictionary, Locale } from '@/app/libs/i18n/types';
import { cx } from '@/app/libs/utils';
import { AvailabilityStatus, Status } from './ui/AvailabilityStatus';
import { LangSwitcher } from './ui/LangSwitcher';
import { SocialNav } from './ui/SocialNav';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

/** Topbar height before the y-padding collapses, per breakpoint. */
function initialHeight(): number {
  if (window.innerWidth >= 1280) return 108; // xl
  if (window.innerWidth >= 768) return 100; // md
  return 92;
}

export const Header: FC<Props> = ({ dict, locale }) => {
  // Collapsed/tinted state applies once the page scrolls past the topbar's
  // initial height; at the top of the page the topbar is fully transparent.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const threshold = initialHeight();

    function handleScroll() {
      setScrolled(window.scrollY > threshold);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cx(
        // Fixed to the viewport edges; collapses once scrolled past its initial height.
        'fixed top-0 left-0 right-0 z-20 px-6 backdrop-blur-md transition-[height,padding] duration-300 md:px-12 xl:px-0',
        // 1px bottom line, fades in with the collapse.
        'after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/15 after:transition-opacity after:duration-300',
        scrolled
          ? 'h-[60px] bg-background/70 py-2 after:opacity-100 md:h-[68px] xl:h-[76px]'
          : 'h-[92px] bg-transparent py-6 after:opacity-0 md:h-[100px] xl:h-[108px]',
      )}
    >
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
