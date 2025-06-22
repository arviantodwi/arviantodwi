import { cx } from '@/app/libs/utils';
import { FC, HTMLAttributes } from 'react';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';
import { GITHUB_URL, LINKEDIN_URL } from '../../libs/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const SocialNav: FC<Props> = ({ className, ...props }) => {
  return (
    <div className={cx('flex justify-center gap-3 items-center h-fit', className)} {...props}>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" title="Arvianto's GitHub">
        <AiFillGithub size={24} />
      </a>
      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" title="Arvianto's LinkedIn">
        <AiFillLinkedin size={24} />
      </a>
    </div>
  );
};
