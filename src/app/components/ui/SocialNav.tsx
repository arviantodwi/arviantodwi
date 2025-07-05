import { cx } from '@/app/libs/utils';
import { FC, HTMLAttributes } from 'react';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';
import { GITHUB_URL, LINKEDIN_URL } from '../../libs/constants';

export const SocialNav: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={cx('flex h-fit items-center justify-center gap-3', className)} {...props}>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" title="Arvianto's GitHub">
        <AiFillGithub size={24} />
      </a>
      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" title="Arvianto's LinkedIn">
        <AiFillLinkedin size={24} />
      </a>
    </div>
  );
};
