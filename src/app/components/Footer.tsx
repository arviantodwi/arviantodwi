import type { FC } from 'react';
import type { Dictionary } from '@/app/libs/i18n/types';
import { SocialNav } from './ui/SocialNav';

interface Props {
  dict: Dictionary;
}

export const Footer: FC<Props> = ({ dict }) => {
  return (
    <footer className="relative z-10 mt-auto bg-neutral-900 px-6 py-8 font-general text-sm md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-col text-center text-white">
        <p className="opacity-60">{dict.footer.copyright}</p>
      </div>
      <SocialNav className="mt-6 sm:hidden" />
    </footer>
  );
};
