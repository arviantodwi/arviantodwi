'use client';

import type { FC } from 'react';
import { NEXT_LOCALE_COOKIE } from '@/app/lib/constants';
import type { Locale } from '@/app/lib/i18n/types';
import { cx } from '@/app/lib/utils';
import { IconLanguage, IconSelector } from './icons';
import { PopoverPanel, popoverOptionClassName, usePopover } from './Popover';

const OPTIONS: { locale: Locale; href: string; label: string }[] = [
  { locale: 'en', href: '/', label: 'English' },
  { locale: 'id', href: '/id', label: 'Bahasa Indonesia' },
];

interface Props {
  locale: Locale;
  className?: string;
}

function persistLocale(locale: Locale) {
  document.cookie = `${NEXT_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

export const LangSwitcher: FC<Props> = ({ locale, className }) => {
  const popover = usePopover();

  return (
    <div ref={popover.rootRef} className={cx('relative self-start', className)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={popover.open}
        aria-label="Language"
        onClick={popover.open ? popover.closePopover : popover.openPopover}
        className="font-general flex cursor-pointer items-center gap-1.5 text-sm text-white"
      >
        <IconLanguage size={18} />
        {locale.toUpperCase()}
        <IconSelector size={14} className="opacity-60" />
      </button>

      <PopoverPanel popover={popover}>
        <ul>
          {OPTIONS.map(({ href, label, locale: optionLocale }) => (
            <li key={optionLocale}>
              {/* Full navigation so the locale-persisting request flows through the proxy. */}
              <a
                href={href}
                aria-current={optionLocale === locale ? 'true' : undefined}
                onClick={() => {
                  persistLocale(optionLocale);
                  popover.closePopover();
                }}
                className={popoverOptionClassName(optionLocale === locale)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </PopoverPanel>
    </div>
  );
};
