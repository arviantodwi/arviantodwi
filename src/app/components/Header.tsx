'use client';

import Image from 'next/image';
import { type FC, useEffect, useState } from 'react';
import type { Dictionary, Locale } from '@/app/lib/i18n/types';
import { cx } from '@/app/lib/utils';
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
        'fixed top-0 right-0 left-0 z-30 px-6 backdrop-blur-md transition-[height,padding] duration-300 md:px-12 xl:px-0',
        // 1px bottom line, fades in with the collapse.
        'after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/15 after:transition-opacity after:duration-300',
        scrolled
          ? 'h-[60px] bg-background/70 py-2 after:opacity-100 md:h-[68px] xl:h-[76px]'
          : 'h-[92px] bg-transparent py-6 after:opacity-0 md:h-[100px] xl:h-[108px]',
      )}
    >
      <div className="mx-auto flex h-full items-center justify-between md:px-6 xl:max-w-[1440px] xl:px-30">
        <div className="flex items-center gap-[18px]">
          {/* Design (.pen Header, node COKOj): 138×32 logo (node Zybny geometry,
              rendered as /logo.svg) then 18px to the 24×24 social anchors. */}
          <Image src="/logo.svg" width={138} height={32} alt="logo" />
          <SocialNav className="hidden sm:flex" />
        </div>
        <div className="flex items-center gap-5">
          {/* Below sm the right side reads: social · divider · language.
              From sm up the badge rejoins (social hides) — the same divider
              then separates badge and switcher. */}
          <SocialNav className="flex sm:hidden" />
          <AvailabilityStatus
            variant={Status.UNAVAILABLE}
            labels={dict.header.status}
            className="hidden sm:flex"
          />
          <span aria-hidden="true" className="h-4 w-px bg-white/15" />
          {/* self-center overrides the component's footer-oriented
              self-start so the switcher sits on the row's centerline. */}
          <LangSwitcher className="self-center" locale={locale} />
        </div>
      </div>
    </header>
  );
};
