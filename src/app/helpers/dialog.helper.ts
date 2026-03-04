import { window } from 'vscode';

/**
 * Displays a message box with the provided message
 *
 * @param {string} prompt - The prompt to display
 * @param {string} placeHolder - The input placeholder
 * @param {string} currentPath - The current path
 * @param {string} validate - The validation function
 * @example
 * const path = await getPath('Enter a path', 'src/app', 'src/app', (path) => {
 *   if (path.length === 0) {
 *     return 'Path cannot be empty';
 * });
 *
 * @returns {Promise<string | undefined>} - The selected path
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
 * Displays a message box with the provided message
 *
 * @param {string} prompt - The prompt to display
 * @param {string} placeHolder - The input placeholder
 * @param {string} validate - The validation function
 * @example
 * const name = await getName('Enter a name', 'foo', (name) => {
 *   if (name.length === 0) {
 *     return 'Name cannot be empty';
 * });
 *
 * @returns {Promise<string | undefined>} - The selected name
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
 * Displays a message box with the provided message
 *
 * @param {string} message - The message to display
 * @example
 * showMessage('Hello, world!');
 *
 * @returns {void} - No return value
 */
export const showMessage = (message: string): void => {
  window.showInformationMessage(message);
};

/**
 * Displays a message box with the provided message
 *
 * @param {string} message - The message to display
 * @example
 * showError('An error occurred');
 *
 * @returns {void} - No return value
 */
export const showError = (message: string): void => {
  window.showErrorMessage(message);
};

/**
 * Displays a message box with the provided message
 *
 * @param {string} message - The message to display
 * @example
 * showWarning('This is a warning');
 *
 * @returns {void} - No return value
 */
export const showWarning = (message: string): void => {
  window.showWarningMessage(message);
};
