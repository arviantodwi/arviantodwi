import { type FC, Fragment } from 'react';
import type { Segment, SegmentTone } from '@/app/libs/i18n/types';

const toneClassName: Record<SegmentTone, string> = {
  dim: 'opacity-75',
  gold: 'font-medium text-gold',
  goldUnderline: 'underline decoration-1 decoration-gold underline-offset-[5px]',
  strong: '',
};

interface Props {
  segments: Segment[];
}

/** Renders a list of tone-tagged text segments with the right styled wrapper. */
export const SegmentedText: FC<Props> = ({ segments }) => (
  <>
    {segments.map((segment, index) => {
      // Static list (no reorder): index keeps repeated segments collision-free.
      const key = `${index}:${segment.tone ?? 'plain'}:${segment.text}`;
      if (!segment.tone) {
        return <Fragment key={key}>{segment.text}</Fragment>;
      }
      if (segment.tone === 'strong') {
        return <strong key={key}>{segment.text}</strong>;
      }
      return (
        <span key={key} className={toneClassName[segment.tone]}>
          {segment.text}
        </span>
      );
    })}
  </>
);
