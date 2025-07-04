'use client';

import { cx } from '@/app/libs/utils';
import { FC, ReactNode } from 'react';
import CountUp from 'react-countup';

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
        className="self-start border-b-2 border-b-gold text-4xl font-bold tabular-nums lg:text-5xl lg:pb-1.5"
      />
      <div className="text-[14px] whitespace-nowrap opacity-60 lg:text-[16px]">{text}</div>
    </div>
  );
};
