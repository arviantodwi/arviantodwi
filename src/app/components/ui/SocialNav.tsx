import type { FC, HTMLAttributes } from 'react';
import { cx } from '@/app/lib/utils';
import { GITHUB_URL, LINKEDIN_URL } from '../../lib/constants';
import { IconGithubMark, IconLinkedinMark } from './icons';

export const SocialNav: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    // Design (.pen Navigation, node gj6H2): 12px gap between 24×24 anchors.
    <div className={cx('flex h-fit items-center justify-center gap-3', className)} {...props}>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Arvianto's GitHub"
        className="flex h-6 w-6 items-center justify-center"
      >
        <IconGithubMark />
      </a>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Arvianto's LinkedIn"
        className="flex h-6 w-6 items-center justify-center"
      >
        <IconLinkedinMark />
      </a>
    </div>
  );
};
