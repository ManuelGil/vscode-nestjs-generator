/**
 * @fileoverview Thin wrappers around the VSCode window API for user-facing
 * dialogs. Centralizes input box and notification usage so controllers
 * don't depend on `vscode.window` directly.
 */

import { window } from 'vscode';

/**
 * Shows an input box for the user to enter or confirm a file path.
 * Pre-fills with `currentPath` and validates input on every keystroke.
 *
 * @param {string} prompt - The prompt to display above the input.
 * @param {string} placeHolder - Placeholder text shown when the input is empty.
 * @param {string} currentPath - Initial value pre-filled in the input.
 * @param {(path: string) => string | undefined} validate - Validation function
 *   called on each keystroke; return an error message to reject input.
 * @example
 * const path = await getPath('Enter a path', 'src/app', 'src/app', (path) => {
 *   if (path.length === 0) {
 *     return 'Path cannot be empty';
 * });
 *
 * @returns {Promise<string | undefined>} The entered path, or `undefined` if dismissed.
 */
export const getPath = async (
  prompt: string,
  placeHolder: string,
  currentPath: string,
  validate: (path: string) => string | undefined,
): Promise<string | undefined> => {
  return await window.showInputBox({
    prompt,
    placeHolder,
    value: currentPath,
    ignoreFocusOut: true,
    validateInput: validate,
  });
};

/**
 * Shows an input box for the user to enter a name (e.g., component or module name).
 * Validates input on every keystroke via the provided function.
 *
 * @param {string} prompt - The prompt to display above the input.
 * @param {string} placeHolder - Placeholder text shown when the input is empty.
 * @param {(name: string) => string | undefined} validate - Validation function
 *   called on each keystroke; return an error message to reject input.
 * @example
 * const name = await getName('Enter a name', 'foo', (name) => {
 *   if (name.length === 0) {
 *     return 'Name cannot be empty';
 * });
 *
 * @returns {Promise<string | undefined>} The entered name, or `undefined` if dismissed.
 */
export const getName = async (
  prompt: string,
  placeHolder: string,
  validate: (name: string) => string | undefined,
): Promise<string | undefined> => {
  return await window.showInputBox({
    prompt,
    placeHolder,
    ignoreFocusOut: true,
    validateInput: validate,
  });
};

/**
 * Convenience wrapper around {@link window.showInformationMessage}.
 *
 * @param {string} message - The informational message to display.
 * @example
 * showMessage('File created successfully');
 *
 * @returns {void}
 */
export const showMessage = (message: string): void => {
  window.showInformationMessage(message);
};

/**
 * Convenience wrapper around {@link window.showErrorMessage}.
 *
 * @param {string} message - The error message to display.
 * @example
 * showError('An error occurred');
 *
 * @returns {void}
 */
export const showError = (message: string): void => {
  window.showErrorMessage(message);
};

/**
 * Convenience wrapper around {@link window.showWarningMessage}.
 *
 * @param {string} message - The warning message to display.
 * @example
 * showWarning('This is a warning');
 *
 * @returns {void}
 */
export const showWarning = (message: string): void => {
  window.showWarningMessage(message);
};
