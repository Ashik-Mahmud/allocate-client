import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatTimeInTimeZone } from "@/lib/utils/timezone-date"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (iso: string, timeZone?: string | null) => formatTimeInTimeZone(iso, timeZone);
