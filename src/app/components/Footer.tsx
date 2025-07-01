import { FC } from 'react';
import { SocialNav } from './ui/SocialNav';

export const Footer: FC = () => {
  return (
    <footer className="relative z-10 mt-auto bg-neutral-900 px-6 py-8 font-general text-sm md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-col text-center text-white">
        <p className="opacity-60">
          &copy; 2025. Trademarks and brands are the property of their respective owners.
        </p>
      </div>
      <SocialNav className="mt-6 sm:hidden" />
    </footer>
  );
};
