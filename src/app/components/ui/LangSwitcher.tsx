'use client';

import Link from 'next/link';
import { type FC, useEffect, useRef, useState } from 'react';
import { TbLanguage, TbSelector } from 'react-icons/tb';
import type { Locale } from '@/app/libs/i18n/types';
import { cx } from '@/app/libs/utils';

const OPTIONS: { locale: Locale; href: string; label: string }[] = [
  { locale: 'en', href: '/', label: 'English' },
  { locale: 'id', href: '/id', label: 'Bahasa Indonesia' },
];

interface Props {
  locale: Locale;
  className?: string;
}

export const LangSwitcher: FC<Props> = ({ locale, className }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-1.5 font-general text-sm text-white"
      >
        <TbLanguage size={18} />
        {locale.toUpperCase()}
        <TbSelector size={14} className="opacity-60" />
      </button>

      {open && (
        <div className="absolute top-full right-0 z-30 mt-2 min-w-[160px] rounded-md border border-white/10 bg-neutral-900 py-1.5 shadow-lg">
          <ul>
            {OPTIONS.map(({ href, label, locale: optionLocale }) => (
              <li key={optionLocale}>
                <Link
                  href={href}
                  aria-current={optionLocale === locale ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                  className={cx(
                    'block text-nowrap px-4 py-1.5 font-general text-sm transition-opacity',
                    optionLocale === locale ? 'text-gold' : 'opacity-75 hover:opacity-100',
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
