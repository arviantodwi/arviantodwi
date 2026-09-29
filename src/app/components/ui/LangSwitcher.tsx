import Link from 'next/link';
import { type FC, Fragment } from 'react';
import type { Locale } from '@/app/libs/i18n/types';
import { cx } from '@/app/libs/utils';

const LINKS: { locale: Locale; href: string; label: string }[] = [
  { locale: 'en', href: '/', label: 'EN' },
  { locale: 'id', href: '/id', label: 'ID' },
];

interface Props {
  locale: Locale;
}

export const LangSwitcher: FC<Props> = ({ locale }) => {
  return (
    <nav aria-label="Language" className="flex items-center gap-2 font-general text-sm">
      {LINKS.map(({ href, label, locale: linkLocale }, index) => (
        <Fragment key={linkLocale}>
          {index > 0 && <span className="opacity-30">/</span>}
          <Link
            href={href}
            aria-current={linkLocale === locale ? 'true' : undefined}
            className={cx(
              'transition-opacity',
              linkLocale === locale ? 'font-medium text-gold' : 'opacity-60 hover:opacity-100',
            )}
          >
            {label}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
};
