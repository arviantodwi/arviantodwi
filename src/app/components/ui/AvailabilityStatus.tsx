import { cx } from '@/app/libs/utils';
import { FC } from 'react';

export enum Status {
  AVAILABLE,
  OPEN,
  UNAVAILABLE,
}

interface Props {
  variant: Status;
}

export const AvailabilityStatus: FC<Props> = ({ variant }) => {
  const statusText =
    variant === Status.OPEN
      ? 'Open to offers'
      : variant === Status.UNAVAILABLE
        ? 'Unavailable for hire'
        : 'Available for hire';

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
