import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  const getKey = typeof key === 'function' ? key : (item: T) => item[key] as unknown as string;
  return array.reduce((result, currentItem) => {
    const groupKey = getKey(currentItem);
    (result[groupKey] = result[groupKey] || []).push(currentItem);
    return result;
  }, {} as Record<string, T[]>);
}
