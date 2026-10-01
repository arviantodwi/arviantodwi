import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { cx } from '@/app/libs/utils';

interface CommonProps {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
}

type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = AnchorProps | NativeButtonProps;

/* Neo-brutalism: sharp corners, thick hard border, offset solid shadow that
   presses in on hover. */
const BASE =
  'inline-flex cursor-pointer items-center justify-center gap-2 border-2 border-black font-general font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const VARIANT: Record<'primary', string> = {
  primary: 'bg-gold text-background',
};

const SIZE: Record<'md' | 'lg', string> = {
  md: 'px-4 py-2 text-sm shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black]',
  lg: 'px-6 py-3 text-base shadow-[6px_6px_0_0_black] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_0_black]',
};

/** Renders an `<a>` when `href` is set, otherwise a native `<button>`. */
export const Button: FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const classes = cx(BASE, VARIANT[variant], SIZE[size], className);

  if ('href' in props && props.href) {
    return (
      <a {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      {children}
    </button>
  );
};
