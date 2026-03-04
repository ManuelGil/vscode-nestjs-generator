import { l10n } from 'vscode';

/**
 * Validation patterns used across the application.
 */

/**
 * Regular expression pattern for validating folder names
 */
const FOLDER_NAME_PATTERN = /^(?!\/)[^\sÀ-ÿ]+?$/;

/**
 * Validates a folder name using the centralized folder name pattern
 *
 * @param path - The path to validate
 * @returns A validation error message if invalid, undefined if valid
 */
export function validateFolderName(path: string): string | undefined {
  if (!FOLDER_NAME_PATTERN.test(path)) {
    return l10n.t('The folder name must be a valid name');
  }
  return;
}
