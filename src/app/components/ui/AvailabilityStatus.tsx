import type { FC } from 'react';
import { cx } from '@/app/libs/utils';

export enum Status {
  AVAILABLE,
  OPEN,
  UNAVAILABLE,
}

interface StatusLabels {
  available: string;
  open: string;
  unavailable: string;
}

interface Props {
  variant: Status;
  labels: StatusLabels;
}

const STATUS_KEY: Record<Status, keyof StatusLabels> = {
  [Status.AVAILABLE]: 'available',
  [Status.OPEN]: 'open',
  [Status.UNAVAILABLE]: 'unavailable',
};

export const AvailabilityStatus: FC<Props> = ({ variant, labels }) => {
  const statusText = labels[STATUS_KEY[variant]];

  const statusDotClassName =
    variant === Status.OPEN
      ? 'bg-gold'
      : variant === Status.UNAVAILABLE
        ? 'bg-rose-600'
        : 'bg-emerald-600';

  const statusTextClassName =
    variant === Status.OPEN
      ? 'text-gold'
      : variant === Status.UNAVAILABLE
        ? 'text-rose-600'
        : 'text-emerald-600';

  return (
    <div className="flex items-center gap-4">
      <span className={cx('status-dot-ripple relative h-2 w-2 rounded-full', statusDotClassName)} />{' '}
      <span className={cx('font-general text-sm', statusTextClassName)}>{statusText}</span>
    </div>
  );
};
