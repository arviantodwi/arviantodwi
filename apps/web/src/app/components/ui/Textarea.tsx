import type { FC, TextareaHTMLAttributes } from 'react';
import { cx } from '@/app/lib/utils';

/* Underline textarea per the .pen "Drawer — Text areas" (node azLph):
   same line mapping as ui/Input (idle #292929, focus-empty white/65, typed
   value → gold line, error #ed5440); 150px minimum height matches the
   drawer master's value region (92px text + 8/12 padding). */
const BASE =
  'min-h-[150px] w-full resize-y border-b bg-transparent px-0 pt-2 pb-3 font-general text-base transition-colors scheme-dark focus:outline-none';
const LINE =
  'border-[#292929] text-white placeholder:text-white/35 focus:placeholder-shown:border-white/65 not-placeholder-shown:border-gold not-placeholder-shown:text-white';
const ERROR_LINE = 'border-[#ed5440] text-[#ed5440] placeholder:text-[#ed5440]/45';
const MESSAGE = 'font-general text-[13px] leading-[1.4] text-[#ed5440]';

export type TextareaProps = {
  error?: string | null;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & { className?: string };

export const Textarea: FC<TextareaProps> = ({
  error,
  className,
  id,
  'aria-describedby': describedBy,
  ...props
}) => {
  const errorId = error && id ? `${id}-error` : null;
  const describedByMerged = [describedBy, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-2">
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedByMerged}
        className={cx(BASE, error ? ERROR_LINE : LINE, className)}
        {...props}
      />
      {error && (
        <p id={errorId ?? undefined} role="alert" className={MESSAGE}>
          {error}
        </p>
      )}
    </div>
  );
};
