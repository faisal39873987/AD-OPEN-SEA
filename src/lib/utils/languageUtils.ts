/**
 * Utilities for handling Arabic text and RTL language support
 */

/**
 * Determines if a string contains Arabic characters
 * @param text The text to check
 * @returns Boolean indicating if Arabic characters were found
 */
export function containsArabic(text: string): boolean {
  // Arabic Unicode range: \u0600-\u06FF
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

/**
 * Determines text direction based on content
 * @param text The text to analyze
 * @returns 'rtl' if Arabic, 'ltr' otherwise
 */
export function getTextDirection(text: string): 'rtl' | 'ltr' {
  return containsArabic(text) ? 'rtl' : 'ltr';
}

/**
 * Adds appropriate CSS classes for text direction
 * @param text The text to analyze
 * @returns CSS class string for text direction
 */
export function getDirectionalClasses(text: string): string {
  return containsArabic(text) 
    ? 'text-right rtl:text-right direction-rtl' 
    : 'text-left ltr:text-left direction-ltr';
}

/**
 * Detects language and applies appropriate font styling
 * @param text The text to analyze
 * @returns CSS class string for font family and direction
 */
export function getLanguageClasses(text: string): string {
  const direction = getDirectionalClasses(text);
  const fontFamily = containsArabic(text) ? 'font-arabic' : '';
  
  return `${direction} ${fontFamily}`.trim();
}
