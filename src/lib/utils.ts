
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears } from 'date-fns';
import type { ChildLevel } from '@/types';

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

/**
 * Formats a number as a currency string.
 * @param amount The number to format.
 * @param currencyCode The currency code (e.g., 'EUR', 'USD').
 * @param locale The locale to use for formatting (e.g., 'es-ES', 'en-US'). Defaults to 'es'.
 * @returns A string representing the formatted currency.
 */
export function formatCurrency(amount: number, currencyCode: 'EUR' | 'USD', locale: string = 'es'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculates the child's level based on the number of achievements unlocked.
 * @param achievementCount The total number of achievements unlocked by the child.
 * @returns The calculated level as a string.
 */
export function calculateChildLevel(achievementCount: number): ChildLevel {
  if (achievementCount >= 10) return 'Leyenda';
  if (achievementCount >= 6) return 'Oro';
  if (achievementCount >= 3) return 'Plata';
  if (achievementCount >= 1) return 'Bronce'; // Adjusted to give Bronze for at least 1 achievement
  return 'Novato'; // Default level if 0 achievements
}

export function getLevelColor(level: ChildLevel): string {
  switch (level) {
    case 'Novato':
      return 'text-gray-500';
    case 'Bronce':
      return 'text-yellow-600'; // More like bronze
    case 'Plata':
      return 'text-gray-400'; // More like silver
    case 'Oro':
      return 'text-yellow-400'; // Gold
    case 'Leyenda':
      return 'text-purple-500'; // Legendary purple
    default:
      return 'text-foreground';
  }
}
