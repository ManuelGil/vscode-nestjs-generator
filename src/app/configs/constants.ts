/**
 * @file Default values and identity constants for the NestJS File Generator extension.
 *
 * These constants serve as fallback defaults when no user configuration is
 * provided, and as identity values (IDs, URLs) used throughout the extension.
 */

/** VSCode configuration scope prefix (e.g. `nestjs.enable`). */
export const EXTENSION_ID: string = 'nestjs';

/** Package/repository name used in marketplace and GitHub URLs. */
export const EXTENSION_NAME: string = 'vscode-nestjs-generator';

/** Human-readable name shown in notifications and UI. */
export const EXTENSION_DISPLAY_NAME: string = 'NestJS File Generator';

/** GitHub username of the extension author. */
export const USER_NAME: string = 'ManuelGil';

/** VSCode Marketplace publisher ID. */
export const USER_PUBLISHER: string = 'imgildev';

/** GitHub repository URL. */
export const EXTENSION_REPOSITORY_URL: string = `https://github.com/${USER_NAME}/${EXTENSION_NAME}`;

/** VSCode Marketplace listing URL. */
export const EXTENSION_MARKETPLACE_URL: string = `https://marketplace.visualstudio.com/items?itemName=${USER_PUBLISHER}.${EXTENSION_NAME}`;

/** GitHub Sponsors URL. */
export const EXTENSION_SPONSOR_URL: string =
  'https://github.com/sponsors/ManuelGil';

/** PayPal donation URL. */
export const EXTENSION_PAYPAL_URL: string =
  'https://www.paypal.com/paypalme/ManuelFGil';

/** Default file extensions to include when scanning the workspace. */
export const INCLUDE: string[] = ['ts'];

/** Default glob patterns to exclude from workspace scans. */
export const EXCLUDE: string[] = [
  '**/node_modules/**',
  '**/dist/**',
  '**/out/**',
  '**/build/**',
  '**/.*/**',
];

/** Default file categories to watch for changes. */
export const WATCH: string[] = ['controllers', 'dtos', 'services'];

/** Default: whether to show relative paths in tree-view items. */
export const SHOW_PATH: boolean = true;

/** Default custom terminal command templates. */
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

/** Default custom file templates for boilerplate generation. */
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

/** Shape of the menu activation configuration controlling which commands are visible. */
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

/** Default menu activation — all file and terminal commands enabled. */
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

/** Default: whether to auto-import generated files into the nearest module. */
export const AUTO_IMPORT: boolean = true;

/** Default: whether to resolve relative paths from the workspace root. */
export const IS_ROOT_CONTEXT: boolean = false;

/** Default: whether to skip the folder selection confirmation dialog. */
export const SKIP_FOLDER_CONFIRMATION: boolean = false;

/** Default ORM used for entity/DTO generation (e.g. 'typeorm', 'sequelize'). */
export const ORM: string = 'typeorm';
