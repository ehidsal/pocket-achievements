
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
