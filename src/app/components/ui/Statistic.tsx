'use client';

import type { FC, ReactNode } from 'react';
import CountUp from 'react-countup';
import { cx } from '@/app/libs/utils';

interface Props {
  text: ReactNode;
  value: number;
  className?: string;
}

export const Statistic: FC<Props> = ({ className, text, value }) => {
  return (
    <div className={cx('flex flex-col gap-2 font-general', className)}>
      <CountUp
        start={0}
        end={value}
        suffix="+"
        className="self-start border-b-2 border-b-gold font-bold text-4xl tabular-nums lg:pb-1.5 lg:text-5xl"
      />
      <div className="whitespace-nowrap text-[14px] opacity-60 lg:text-[16px]">{text}</div>
    </div>
  );
};
