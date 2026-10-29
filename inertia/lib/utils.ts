import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Gabungkan kelas Tailwind dengan aman: `clsx` menangani kondisional,
 * `twMerge` menyelesaikan konflik kelas (mis. `p-2 p-4` → `p-4`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
