'use client';

import type { FC, ReactNode } from 'react';
import CountUp from 'react-countup';
import { cx } from '@/app/lib/utils';

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
        className="border-b-gold self-start border-b-2 text-4xl font-bold tabular-nums lg:pb-1.5 lg:text-5xl"
      />
      <div className="text-[14px] whitespace-nowrap opacity-60 lg:text-[16px]">{text}</div>
    </div>
  );
};
