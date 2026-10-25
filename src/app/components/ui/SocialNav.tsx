import type { FC, HTMLAttributes } from 'react';
import { cx } from '@/app/lib/utils';
import { GITHUB_URL, LINKEDIN_URL } from '../../lib/constants';
import { IconBrandGithub, IconBrandLinkedin } from './icons';

export const SocialNav: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cx('flex h-fit items-center justify-center gap-3', className)} {...props}>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" title="Arvianto's GitHub">
        <IconBrandGithub size={24} />
      </a>
      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" title="Arvianto's LinkedIn">
        <IconBrandLinkedin size={24} />
      </a>
    </div>
  );
};
