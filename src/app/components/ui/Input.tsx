import type { FC, InputHTMLAttributes } from 'react';
import { cx } from '@/app/lib/utils';

/* Underline text field per the .pen "Drawer — Input fields" (node uKTB8):
   idle line #292929, focus-empty line white/65, typed value → gold line,
   error #ed5440 (invalid text, faint placeholder tint, message row below).
   Every native input type (text, email, number, password, tel, url, search,
   date, …) rides through the InputHTMLAttributes passthrough.
   The idle/focus line mapping reads `:placeholder-shown`, so pass a
   `placeholder` for fields that sit empty. */
const BASE =
  'h-11 w-full border-b bg-transparent px-0 pt-2 pb-3 font-general text-base transition-colors scheme-dark focus:outline-none';
const LINE =
  'border-[#292929] text-white placeholder:text-white/35 focus:placeholder-shown:border-white/65 not-placeholder-shown:border-gold not-placeholder-shown:text-white';
const ERROR_LINE = 'border-[#ed5440] text-[#ed5440] placeholder:text-[#ed5440]/45';
const MESSAGE = 'font-general text-[13px] leading-[1.4] text-[#ed5440]';

export type InputProps = {
  error?: string | null;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { className?: string };

/** Renders the error message row (drawer's Error · Message variant). */
export const Input: FC<InputProps> = ({
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
      <input
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
