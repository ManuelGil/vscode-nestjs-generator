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
export const EXTENSION_ID: string = 'nestjs';

/**
 * EXTENSION_NAME: The repository ID of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_NAME);
 *
 * @returns {string} - The repository ID of the extension
 */
export const EXTENSION_NAME: string = 'vscode-nestjs-generator';

/**
 * EXTENSION_DISPLAY_NAME: The name of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_DISPLAY_NAME);
 *
 * @returns {string} - The name of the extension
 */
export const EXTENSION_DISPLAY_NAME: string = 'NestJS File Generator';

/**
 * USER_NAME: The githubUsername of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(USER_NAME);
 *
 * @returns {string} - The githubUsername of the extension
 */
export const USER_NAME: string = 'ManuelGil';

/**
 * USER_PUBLISHER: The publisher of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(USER_PUBLISHER);
 *
 * @returns {string} - The publisher of the extension
 */
export const USER_PUBLISHER: string = 'imgildev';

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
export const EXTENSION_REPOSITORY_URL: string = `https://github.com/${USER_NAME}/${EXTENSION_NAME}`;

/**
 * MARKETPLACE_URL: The marketplace URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(MARKETPLACE_URL);
 *
 * @returns {string} - The marketplace URL of the extension
 */
export const EXTENSION_MARKETPLACE_URL: string = `https://marketplace.visualstudio.com/items?itemName=${USER_PUBLISHER}.${EXTENSION_NAME}`;

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
export const EXTENSION_SPONSOR_URL: string =
  'https://github.com/sponsors/ManuelGil';

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
export const EXTENSION_PAYPAL_URL: string =
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
export const INCLUDE: string[] = ['ts'];
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
export const EXCLUDE: string[] = [
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
export const WATCH: string[] = ['controllers', 'dtos', 'services'];

/**
 * SHOW_PATH: Whether to show the path or not.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(SHOW_PATH);
 *
 * @returns {boolean} - Whether to show the path or not
 */
export const SHOW_PATH: boolean = true;

/**
 * CUSTOM_COMMANDS: The custom commands.
 * @type {object[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(CUSTOM_COMMANDS);
 *
 * @returns {object[]} - The custom commands
 */
export const CUSTOM_COMMANDS: object[] = [
  {
    'name': 'Template 1',
    'command': 'nest g co',
    'args': '--flat',
  },
  {
    'name': 'Template 2',
    'command': 'nest g co',
    'args': '--no-flat',
  },
];

/**
 * CUSTOM_TEMPLATES: The custom templates.
 * @type {object[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(CUSTOM_TEMPLATES);
 *
 * @returns {object[]} - The custom templates
 */
export const CUSTOM_TEMPLATES: object[] = [
  {
    'name': 'Custom Service',
    'description': 'Generate a custom service',
    'type': 'service',
    'template': [
      "import { Injectable } from '@nestjs/common';",
      '',
      '@Injectable()',
      'export class CustomService {',
      '}',
    ],
  },
];

/**
 * MenuIterface: The menu options.
 * @type {object}
 * @public
 * @memberof Constants
 * @example
 * console.log(MenuIterface);
 *
 * @returns {object} - The menu options
 */
export interface MenuInterface {
  file: {
    class: boolean;
    controller: boolean;
    decorator: boolean;
    dto: boolean;
    exception: boolean;
    exceptionFilter: boolean;
    filter: boolean;
    gateway: boolean;
    guard: boolean;
    interceptor: boolean;
    interface: boolean;
    jwtGuard: boolean;
    jwtStrategy: boolean;
    middleware: boolean;
    logger: boolean;
    module: boolean;
    pipe: boolean;
    provider: boolean;
    resolver: boolean;
    service: boolean;
    test: boolean;
    template: boolean;
  };
  terminal: {
    controller: boolean;
    gateway: boolean;
    library: boolean;
    module: boolean;
    provider: boolean;
    resolver: boolean;
    resource: boolean;
    service: boolean;
    custom: boolean;
    start: boolean;
    startDev: boolean;
    startDebug: boolean;
    startProd: boolean;
  };
}

/**
 * ACTIVATE_MENU: Whether to show the menu or not.
 * @type {object}
 * @public
 * @memberof Constants
 * @example
 * console.log(ACTIVATE_MENU);
 *
 * @returns {object} - Whether to show the menu or not
 */
export const ACTIVATE_MENU: MenuInterface = {
  file: {
    class: true,
    controller: true,
    decorator: true,
    dto: true,
    exception: true,
    exceptionFilter: true,
    filter: true,
    gateway: true,
    guard: true,
    interceptor: true,
    interface: true,
    jwtGuard: true,
    jwtStrategy: true,
    middleware: true,
    logger: true,
    module: true,
    pipe: true,
    provider: true,
    resolver: true,
    service: true,
    test: true,
    template: true,
  },
  terminal: {
    controller: true,
    gateway: true,
    library: true,
    module: true,
    provider: true,
    resolver: true,
    resource: true,
    service: true,
    custom: true,
    start: true,
    startDev: true,
    startDebug: true,
    startProd: true,
  },
};

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
export const AUTO_IMPORT: boolean = true;

/**
 * SKIP_FOLDER_CONFIRMATION: Whether to skip the folder confirmation or not.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(SKIP_FOLDER_CONFIRMATION);
 *
 * @returns {boolean} - Whether to skip the folder confirmation or not
 */
export const SKIP_FOLDER_CONFIRMATION: boolean = false;

/**
 * ORM: The orm.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(ORM);
 *
 * @returns {string} - The orm
 */
export const ORM: string = 'typeorm';
