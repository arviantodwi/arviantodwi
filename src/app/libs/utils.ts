import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using `clsx` and then merges them with `twMerge`.
 * This function is useful for conditionally applying Tailwind CSS classes.
 *
 * @param {...ClassValue[]} inputs - An array of class names or conditional objects.
 * @returns {string} A string containing the combined and merged class names.
 */
export function cx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
