/**
 * @fileoverview Input validation functions used by dialog helpers to enforce
 * naming constraints before file or folder creation.
 */

import { l10n } from 'vscode';

/**
 * Validates folder/path names entered by the user. The pattern enforces:
 * - Must not start with `/` (prevents absolute paths).
 * - Must not contain whitespace characters.
 * - Must not contain accented/diacritical characters (À-ÿ range),
 *   keeping generated paths ASCII-safe for maximum cross-platform compatibility.
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
