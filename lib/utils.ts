import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', {
  hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC'
});
