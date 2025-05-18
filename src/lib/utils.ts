import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(birthDateString: string): number {
  const birthDate = new Date(birthDateString);
  return differenceInYears(new Date(), birthDate);
}

export function getProgressColorStyle(percentage: number): React.CSSProperties {
  const p = Math.max(0, Math.min(100, percentage));
  // Hue: 0 (red) -> 60 (yellow) -> 120 (green)
  const hue = (p / 100) * 120;
  return {
    backgroundColor: `hsl(${hue}, 70%, 45%)`,
    transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out',
  };
}
