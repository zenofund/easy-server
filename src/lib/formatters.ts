/**
 * Formats a number or string with thousand separators.
 * @param value The value to format
 * @returns Formatted string (e.g., 2,000,000)
 */
export const formatAmount = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '';
  
  // Convert to string and remove existing commas and non-numeric characters (except decimal)
  const stringValue = value.toString().replace(/,/g, '');
  const numberValue = parseFloat(stringValue);
  
  if (isNaN(numberValue)) return '';
  
  return numberValue.toLocaleString('en-US');
};

/**
 * Removes thousand separators from a formatted string.
 * @param value The formatted string
 * @returns Clean numeric string
 */
export const cleanAmount = (value: string): string => {
  return value.replace(/,/g, '');
};

/**
 * Formats a long ID into a short form (last 8 characters, uppercase).
 * @param id The long ID to format
 * @returns Shortened ID (e.g., AB12CD34)
 */
export const formatID = (id: string | undefined | null): string => {
  if (!id) return '';
  return id.slice(-8).toUpperCase();
};

/**
 * Calculates the duration since a given date and returns a formatted string.
 * @param date The start date (ISO string or Date object)
 * @returns Formatted duration (e.g., "3 days", "2 weeks", "5 months", "5 years")
 */
export const formatDurationSince = (date: string | Date | undefined | null): string => {
  if (!date) return 'New on Huce Autos';
  
  const start = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - start.getTime();
  
  if (diffInMs < 0) return 'Just joined';

  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  // 1-6 days
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} on Huce Autos`;
  }
  
  // 1-4 weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} on Huce Autos`;
  }
  
  // 1-11 months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} on Huce Autos`;
  }
  
  // 1+ years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} on Huce Autos`;
};
