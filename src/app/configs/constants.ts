/**
 * EXTENSION_ID: The unique identifier of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_ID);
 *
 * @returns {string} - The unique identifier of the extension
 */
export const EXTENSION_ID = 'nestjs';

/**
 * EXTENSION_NAME: The name of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_NAME);
 *
 * @returns {string} - The name of the extension
 */
export const EXTENSION_NAME = 'NestJS File Generator';

/**
 * EXTENSION_HOMEPAGE_URL: The homepage URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_HOMEPAGE_URL);
 *
 * @returns {string} - The homepage URL of the extension
 */
export const EXTENSION_HOMEPAGE_URL =
  'https://github.com/ManuelGil/vscode-nestjs-generator#readme';

/**
 * EXTENSION_REPOSITORY_URL: The repository URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_REPOSITORY_URL);
 *
 * @returns {string} - The repository URL of the extension
 */
export const EXTENSION_REPOSITORY_URL =
  'https://github.com/ManuelGil/vscode-nestjs-generator';

/**
 * EXTENSION_MARKETPLACE_URL: The marketplace URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_MARKETPLACE_URL);
 *
 * @returns {string} - The marketplace URL of the extension
 */
export const EXTENSION_MARKETPLACE_URL =
  'https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator';

/**
 * EXTENSION_BUGS_URL: The bugs URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_BUGS_URL);
 *
 * @returns {string} - The bugs URL of the extension
 */
export const EXTENSION_BUGS_URL =
  'https://github.com/ManuelGil/vscode-nestjs-generator/issues';

/**
 * EXTENSION_SPONSOR_URL: The sponsor URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_SPONSOR_URL);
 *
 * @returns {string} - The sponsor URL of the extension
 */
export const EXTENSION_SPONSOR_URL = 'https://github.com/sponsors/ManuelGil';

/**
 * EXTENSION_PAYPAL_URL: The PayPal URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_PAYPAL_URL);
 *
 * @returns {string} - The PayPal URL of the extension
 */
export const EXTENSION_PAYPAL_URL =
  'https://www.paypal.com/paypalme/ManuelFGil';

/**
 * INCLUDE: The files to include.
 * @type {string[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(INCLUDE);
 *
 * @returns {string[]} - The files to include
 */
export const INCLUDE = ['ts'];
/**
 * EXCLUDE: The files to exclude.
 * @type {string[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXCLUDE);
 *
 * @returns {string[]} - The files to exclude
 */
export const EXCLUDE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/out/**',
  '**/build/**',
  '**/.*/**',
];

/**
 * WATCH: The files to watch.
 * @type {string[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(WATCH);
 *
 * @returns {string[]} - The files to watch
 */
export const WATCH = ['controllers', 'dtos', 'services'];

/**
 * AUTO_IMPORT: The auto import setting.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(AUTO_IMPORT);
 *
 * @returns {boolean} - The auto import setting
 */
export const AUTO_IMPORT = true;
