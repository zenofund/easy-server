import { API_BASE_URL } from '../lib/api';

/**
 * Resolves an avatar path to a full URL.
 * Handles:
 * - Null/Undefined (returns default avatar)
 * - Absolute URLs (http/https)
 * - Figma mock URLs
 * - Relative paths (appends backend base URL)
 */
export const getAvatarUrl = (avatarPath: string | null | undefined) => {
  if (!avatarPath) return null;
  
  // If it's already a full URL or a figma placeholder, return it as is
  if (avatarPath.startsWith('http') || avatarPath.startsWith('figma:')) {
    return avatarPath;
  }
  
  // Ensure the base URL doesn't end with /api for static files
  const baseUrl = API_BASE_URL.replace('/api', '');
  
  // Ensure avatarPath starts with / if it doesn't have it
  const path = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
  
  return `${baseUrl}${path}`;
};

/**
 * Gets initials from a full name.
 * @param firstName User's first name
 * @param lastName User's last name
 * @returns Initials (e.g., "SH" for "Super Hero")
 */
export const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
  const f = firstName?.trim().charAt(0) || '';
  const l = lastName?.trim().charAt(0) || '';
  return (f + l).toUpperCase() || '?';
};
