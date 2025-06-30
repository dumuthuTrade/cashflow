import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine clsx and tailwind-merge
 * Helps with conditional classes and prevents Tailwind CSS conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
