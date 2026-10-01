import type { FC } from 'react';
import type { Dictionary, Locale } from '@/app/libs/i18n/types';
import { LangSwitcher } from './ui/LangSwitcher';
import { SocialNav } from './ui/SocialNav';

const LUCAS_LINKEDIN_URL = 'https://www.linkedin.com/in/lucas-brancher/';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export const Footer: FC<Props> = ({ dict, locale }) => {
  const [before, name, after] = dict.footer.copyright.split(/<\/?link>/);

  return (
    <footer className="relative z-10 mt-auto bg-neutral-900 px-6 py-8 font-general text-sm md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-col text-left text-white sm:text-center">
        <p className="opacity-60">
          {before}
          <a
            href={LUCAS_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-opacity hover:opacity-80"
          >
            {name ?? 'Lucas Brancher'}
          </a>{' '}
          {after.trim()}
        </p>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-white sm:hidden">
        <SocialNav />
        <LangSwitcher locale={locale} />
      </div>
    </footer>
  );
};
