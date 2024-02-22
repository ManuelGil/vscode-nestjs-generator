import { Uri, window } from 'vscode';

// Import the helper functions
import { getName, getPath, getRelativePath, runCommand } from '../helpers';

/**
 * The TerminalController class.
 *
 * @class
 * @classdesc The class that represents the example controller.
 * @export
 * @public
 * @example
 * const controller = new TerminalController(config);
 */
export class TerminalController {
  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the TerminalController class.
   *
   * @constructor
   * @public
   * @memberof TerminalController
   */
  constructor() {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * The generateApp method.
   *
   * @function generateApp
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateApp();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateController(path?: Uri): Promise<void> {
    // Get the relative path
    const folderPath: string = path ? await getRelativePath(path.path) : '';

    // Get the path to the folder
    const folder = await getPath(
      'Controller name',
      'Controller name. E.g. modules/cats, modules/users, modules/projects...',
      folderPath,
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder:
        'Select the options for the controller generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g co ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate controller', command);
  }

  /**
   * The generateGateway method.
   *
   * @function generateGateway
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateGateway();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateGateway(path?: Uri): Promise<void> {
    // Get the relative path
    const folderPath: string = path ? await getRelativePath(path.path) : '';

    // Get the path to the folder
    const folder = await getPath(
      'Gateway name',
      'Gateway name. E.g. modules/cats, modules/users, modules/projects...',
      folderPath,
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder: 'Select the options for the gateway generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g ga ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate gateway', command);
  }

  /**
   * The generateInterceptor method.
   *
   * @function generateInterceptor
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateInterceptor();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateLibrary(): Promise<void> {
    const folder = await getName(
      'Library name',
      'Library name. E.g. cats, users, projects...',
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder: 'Select the options for the library generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g lib ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate library', command);
  }

  /**
   * The generateMiddleware method.
   *
   * @function generateMiddleware
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateMiddleware();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateModule(path?: Uri): Promise<void> {
    // Get the relative path
    const folderPath: string = path ? await getRelativePath(path.path) : '';

    // Get the path to the folder
    const folder = await getPath(
      'Module name',
      'Module name. E.g. modules/cats, modules/users, modules/projects...',
      folderPath,
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder: 'Select the options for the module generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g mo ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate module', command);
  }

  /**
   * The generatePipe method.
   *
   * @function generatePipe
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generatePipe();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateProvider(path?: Uri): Promise<void> {
    // Get the relative path
    const folderPath: string = path ? await getRelativePath(path.path) : '';

    // Get the path to the folder
    const folder = await getPath(
      'Provider name',
      'Provider name. E.g. providers/cats, providers/users, providers/projects...',
      folderPath,
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder: 'Select the options for the provider generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g pr ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate provider', command);
  }

  /**
   * The generatePipe method.
   *
   * @function generatePipe
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generatePipe();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateResolver(path?: Uri): Promise<void> {
    // Get the relative path
    const folderPath: string = path ? await getRelativePath(path.path) : '';

    // Get the path to the folder
    const folder = await getPath(
      'Resolver name',
      'Resolver name. E.g. resolvers/cats, resolvers/users, resolvers/projects...',
      folderPath,
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder: 'Select the options for the resolver generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g r ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate resolver', command);
  }

  /**
   * The generateResource method.
   *
   * @function generateResource
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateResource();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateResource(path?: Uri): Promise<void> {
    // Get the relative path
    const folderPath: string = path ? await getRelativePath(path.path) : '';

    // Get the path to the folder
    const folder = await getPath(
      'Resource name',
      'Resource name. E.g. modules/cats, modules/users, modules/projects...',
      folderPath,
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder: 'Select the options for the resource generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g res ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate resource', command);
  }

  /**
   * The generateService method.
   *
   * @function generateService
   * @public
   * @memberof TerminalController
   * @example
   * await generateService();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  start(): void {
    runCommand('start', 'nest start');
  }

  /**
   * The startDev method.
   *
   * @function startDev
   * @public
   * @memberof TerminalController
   * @example
   * await startDev();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  startDev(): void {
    runCommand('dev', 'nest start --watch');
  }

  /**
   * The startDebug method.
   *
   * @function startDebug
   * @public
   * @memberof TerminalController
   * @example
   * await startDebug();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  startDebug(): void {
    runCommand('debug', 'nest start --debug --watch');
  }

  /**
   * The startProd method.
   *
   * @function startProd
   * @public
   * @memberof TerminalController
   * @example
   * await startProd();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  startProd(): void {
    runCommand('prod', 'node dist/main');
  }

  /**
   * The generateSubApp method.
   *
   * @function generateSubApp
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateSubApp();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateService(path?: Uri): Promise<void> {
    // Get the relative path
    const folderPath: string = path ? await getRelativePath(path.path) : '';

    // Get the path to the folder
    const folder = await getPath(
      'Service name',
      'Service name. E.g. services/cats, services/users, services/projects...',
      folderPath,
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder: 'Select the options for the service generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g s ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate service', command);
  }

  /**
   * The generateSubApp method.
   *
   * @function generateSubApp
   * @public
   * @memberof TerminalController
   * @example
   * await generateSubApp();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateSubApp(): Promise<void> {
    const folder = await getName(
      'Sub-app name',
      'Sub-app name. E.g. cats, users, projects...',
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (!folder) {
      return;
    }

    const items = [
      {
        label: '--dry-run',
        description:
          'Report actions that would be taken without writing out results.',
      },
      {
        label: '--flat',
        description: 'Enforce flat structure of generated element.',
      },
      {
        label: '--skip-import',
        description: 'Skip importing (default: false)',
      },
      {
        label: '--no-spec',
        description: 'Disable spec files generation.',
      },
    ];

    const options = await window.showQuickPick(items, {
      placeHolder: 'Select the options for the sub-app generation (optional)',
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g app ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate sub-app', command);
  }
}
