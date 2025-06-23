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
    <div className={cx("flex grow basis-0 flex-col gap-2 font-general", className)}>
      <CountUp start={0} end={value} suffix="+" className="text-4xl font-bold border-b-2 border-b-gold w-fit" />
      <div className="text-[14px] whitespace-nowrap opacity-60">{text}</div>
    </div>
  );
};
