import { l10n, Uri, window, workspace } from 'vscode';

// Import the Config and helper functions
import { Config } from '../configs';
import { getName, getPath, runCommand } from '../helpers';

/**
 * The TerminalController class.
 *
 * @class
 * @classdesc The class that represents the example controller.
 * @export
 * @public
 * @property {Config} config - The configuration
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
   * @param {Config} config - The configuration
   * @public
   * @memberof TerminalController
   */
  constructor(private readonly config: Config) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * The generateController method.
   *
   * @function generateController
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateController();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateController(path?: Uri): Promise<void> {
    // Get the relative path
    let folderPath: string = path ? workspace.asRelativePath(path.path) : '';

    if (this.config.cwd) {
      const cwd = workspace.asRelativePath(Uri.file(this.config.cwd).path);
      folderPath = folderPath.replace(cwd, '');

      if (folderPath.startsWith('/')) {
        folderPath = folderPath.substring(1);
      }
    }

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
      placeHolder: l10n.t(
        'Select the options for the controller generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g co ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate controller', command, this.config.cwd);
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
    let folderPath: string = path ? workspace.asRelativePath(path.path) : '';

    if (this.config.cwd) {
      const cwd = workspace.asRelativePath(Uri.file(this.config.cwd).path);
      folderPath = folderPath.replace(cwd, '');

      if (folderPath.startsWith('/')) {
        folderPath = folderPath.substring(1);
      }
    }

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
      placeHolder: l10n.t(
        'Select the options for the gateway generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g ga ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate gateway', command, this.config.cwd);
  }

  /**
   * The generateLibrary method.
   *
   * @function generateLibrary
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateLibrary();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateLibrary(): Promise<void> {
    const folder = await getName(
      l10n.t('Enter library name'),
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
      placeHolder: l10n.t(
        'Select the options for the library generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g lib ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate library', command, this.config.cwd);
  }

  /**
   * The generateModule method.
   *
   * @function generateModule
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateModule();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateModule(path?: Uri): Promise<void> {
    // Get the relative path
    let folderPath: string = path ? workspace.asRelativePath(path.path) : '';

    if (this.config.cwd) {
      const cwd = workspace.asRelativePath(Uri.file(this.config.cwd).path);
      folderPath = folderPath.replace(cwd, '');

      if (folderPath.startsWith('/')) {
        folderPath = folderPath.substring(1);
      }
    }

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
      placeHolder: l10n.t(
        'Select the options for the module generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g mo ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate module', command, this.config.cwd);
  }

  /**
   * The generateProvider method.
   *
   * @function generateProvider
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateProvider();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateProvider(path?: Uri): Promise<void> {
    // Get the relative path
    let folderPath: string = path ? workspace.asRelativePath(path.path) : '';

    if (this.config.cwd) {
      const cwd = workspace.asRelativePath(Uri.file(this.config.cwd).path);
      folderPath = folderPath.replace(cwd, '');

      if (folderPath.startsWith('/')) {
        folderPath = folderPath.substring(1);
      }
    }

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
      placeHolder: l10n.t(
        'Select the options for the provider generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g pr ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate provider', command, this.config.cwd);
  }

  /**
   * The generateResolver method.
   *
   * @function generateResolver
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateResolver();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateResolver(path?: Uri): Promise<void> {
    // Get the relative path
    let folderPath: string = path ? workspace.asRelativePath(path.path) : '';

    if (this.config.cwd) {
      const cwd = workspace.asRelativePath(Uri.file(this.config.cwd).path);
      folderPath = folderPath.replace(cwd, '');

      if (folderPath.startsWith('/')) {
        folderPath = folderPath.substring(1);
      }
    }

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
      placeHolder: l10n.t(
        'Select the options for the resolver generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g r ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate resolver', command, this.config.cwd);
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
    let folderPath: string = path ? workspace.asRelativePath(path.path) : '';

    if (this.config.cwd) {
      const cwd = workspace.asRelativePath(Uri.file(this.config.cwd).path);
      folderPath = folderPath.replace(cwd, '');

      if (folderPath.startsWith('/')) {
        folderPath = folderPath.substring(1);
      }
    }

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
      placeHolder: l10n.t(
        'Select the options for the resource generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g res ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate resource', command, this.config.cwd);
  }

  /**
   * The start method.
   *
   * @function start
   * @public
   * @memberof TerminalController
   * @example
   * start();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  start(): void {
    runCommand('start', 'nest start', this.config.cwd);
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
    runCommand('dev', 'nest start --watch', this.config.cwd);
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
    runCommand('debug', 'nest start --debug --watch', this.config.cwd);
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
    runCommand('prod', 'node dist/main', this.config.cwd);
  }

  /**
   * The generateService method.
   *
   * @function generateService
   * @param {Uri} [path] The path to the folder.
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * await generateService();
   *
   * @returns {Promise<void>} The promise that resolves the method.
   */
  async generateService(path?: Uri): Promise<void> {
    // Get the relative path
    let folderPath: string = path ? workspace.asRelativePath(path.path) : '';

    if (this.config.cwd) {
      const cwd = workspace.asRelativePath(Uri.file(this.config.cwd).path);
      folderPath = folderPath.replace(cwd, '');

      if (folderPath.startsWith('/')) {
        folderPath = folderPath.substring(1);
      }
    }

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
      placeHolder: l10n.t(
        'Select the options for the service generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g s ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate service', command, this.config.cwd);
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
      l10n.t('Enter sub-app name'),
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
      placeHolder: l10n.t(
        'Select the options for the sub-app generation (optional)',
      ),
      canPickMany: true,
    });

    const filename = folder.replace('src/', '');

    const command =
      `nest g app ${filename}` +
      (options ? ' ' + options.map((item: any) => item.label).join(' ') : '');

    runCommand('generate sub-app', command, this.config.cwd);
  }

  /**
   * Generates a custom element.
   *
   * @function generateCustomElement
   * @param {Uri} [path] - The path
   * @public
   * @async
   * @memberof TerminalController
   * @example
   * controller.generateCustomElement();
   *
   * @returns {Promise<void>} - No return value
   */
  async generateCustomElement(path?: Uri): Promise<void> {
    // Get the relative path
    let folderPath: string = path ? workspace.asRelativePath(path.path) : '';

    if (this.config.cwd) {
      const cwd = workspace.asRelativePath(Uri.file(this.config.cwd).path);
      folderPath = folderPath.replace(cwd, '');

      if (folderPath.startsWith('/')) {
        folderPath = folderPath.substring(1);
      }
    }

    // Get the path to the folder
    let folder = await getPath(
      'Element name',
      'Element name. E.g. src/app/modules/users, modules/users, modules/projects...',
      folderPath,
      (path: string) => {
        if (!/^(?!\/)[^\sÀ-ÿ]+?$/.test(path)) {
          return 'The folder name must be a valid name';
        }
        return;
      },
    );

    if (folder === undefined) {
      return;
    }

    const items = this.config.customCommands.map((item: any) => {
      return {
        label: item.name,
        description: item.command,
        detail: item.args,
      };
    });

    const option = await window.showQuickPick(items, {
      placeHolder: l10n.t(
        'Select the template for the custom element generation',
      ),
    });

    if (option === undefined) {
      return;
    }

    folder = folder.replace('src/', '');

    const command = `${option.description} ${folder} ${option.detail}`;

    runCommand('generate custom element', command, this.config.cwd);
  }
}
