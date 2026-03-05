/**
 * @fileoverview String inflection utilities for converting between naming
 * conventions. Primarily used to transform PascalCase class names
 * (e.g. `UserProfile`) into kebab-case filenames (e.g. `user-profile`).
 */

/**
 * Changes a string of words separated by spaces or camel or pascal case to lowercase with dashes.
 *
 * @param {string} str - The string to dasherize
 * @example
 * dasherize('foo bar');
 *
 * @returns {string} - The dasherized string
 */
export const dasherize = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : `-${word.toLowerCase()}`,
    )
    .replace(/\s+/g, '-');
};

/**
 * Changes a string to its title case form.
 *
 * @param {string} str - The string to titleize
 * @example
 * titleize('foo bar');
 *
 * @returns {string} - The titleized string
 */
export const titleize = (str: string): string => {
  return str
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
};
