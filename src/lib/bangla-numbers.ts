/**
 * Bangla Number Conversion Utilities
 * Converts English numerals to Bangla (Bengali) numerals
 */

// Bangla digits mapping
const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Convert English number to Bangla numerals
 * Examples:
 *   toBanglaNumber(123) → "১২৩"
 *   toBanglaNumber("45.6") → "৪৫.৬"
 */
export function toBanglaNumber(num: number | string): string {
  return String(num).replace(/\d/g, (digit) => BANGLA_DIGITS[parseInt(digit)]);
}

/**
 * Convert Bangla numerals back to English
 */
export function toEnglishNumber(banglaNum: string): string {
  return banglaNum.replace(/[০-৯]/g, (digit) => {
    return BANGLA_DIGITS.indexOf(digit).toString();
  });
}

/**
 * Format temperature in Bangla
 * Example: 32 → "৩२°সে"
 */
export function formatTemperatureBn(celsius: number): string {
  return `${toBanglaNumber(Math.round(celsius))}°সে`;
}

/**
 * Format percentage in Bangla
 * Example: 85 → "৮५%"
 */
export function formatPercentageBn(percentage: number): string {
  return `${toBanglaNumber(Math.round(percentage))}%`;
}

/**
 * Format date in Bangla (returns Bengali day name)
 * Example: new Date('2025-01-15') → "১৫ জানুয়ারী"
 */
export function formatDateBn(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const banglaMonths = [
    'জানুয়ারী',
    'ফেব্রুয়ারী',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];

  const day = dateObj.getDate();
  const month = banglaMonths[dateObj.getMonth()];

  return `${toBanglaNumber(day)} ${month}`;
}

/**
 * Format complete date with year in Bangla
 */
export function formatDateFullBn(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const banglaMonths = [
    'জানুয়ারী',
    'ফেব্রুয়ারী',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];

  const day = dateObj.getDate();
  const month = banglaMonths[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${toBanglaNumber(day)} ${month}, ${toBanglaNumber(year)}`;
}
