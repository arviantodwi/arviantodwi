'use client';

import { cx } from '@/app/libs/utils';
import { FC } from 'react';
import CountUp from 'react-countup';

interface Props {
  text: string;
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
        className="self-start border-b-2 border-b-gold text-4xl font-bold tabular-nums"
      />
      <div className="text-[14px] whitespace-nowrap opacity-60">{text}</div>
    </div>
  );
};
