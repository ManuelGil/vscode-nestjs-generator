import { WorkspaceConfiguration, workspace } from 'vscode';

import {
  ACTIVATE_MENU,
  AUTO_IMPORT,
  CUSTOM_COMMANDS,
  CUSTOM_TEMPLATES,
  EXCLUDE,
  INCLUDE,
  MenuInterface,
  ORM,
  SHOW_PATH,
  SKIP_FOLDER_CONFIRMATION,
  WATCH,
} from './constants';

/**
 * The Config class.
 *
 * @class
 * @classdesc The class that represents the configuration of the extension.
 * @export
 * @public
 * @property {WorkspaceConfiguration} config - The workspace configuration
 * @property {string[]} include - The files to include
 * @property {string[]} exclude - The files to exclude
 * @property {string[]} watch - The files to watch
 * @property {boolean} showPath - Whether to show the path or not
 * @property {object[]} customCommands - The custom commands
 * @property {object[]} customTemplates - The custom templates
 * @property {object} activateItem - Whether to show the menu or not
 * @property {boolean} autoImport - The auto import setting
 * @property {boolean} skipFolderConfirmation - Whether to skip the folder confirmation or not
 * @property {string} orm - The orm
 * @example
 * const config = new Config(workspace.getConfiguration());
 * console.log(config.include);
 * console.log(config.exclude);
 * console.log(config.watch);
 * console.log(config.autoImport);
 */
export class Config {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /**
   * Whether the extension is enabled or not.
   * @type {boolean}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.enable);
   */
  enable: boolean;
  /**
   * The files to include.
   * @type {string[]}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.include);
   */
  include: string[];
  /**
   * The files to exclude.
   * @type {string[]}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.exclude);
   */
  exclude: string[];
  /**
   * The files to watch.
   * @type {string[]}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.watch);
   */
  watch: string[];
  /**
   * Whether to show the path or not.
   * @type {boolean}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.showPath);
   */
  showPath: boolean;
  /**
   * The current working directory.
   * @type {string | undefined}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.cwd);
   */
  cwd: string | undefined;
  /**
   * The custom commands.
   * @type {object[]}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.customCommands);
   * console.log(config.customCommands[0].name);
   * console.log(config.customCommands[0].command);
   * console.log(config.customCommands[0].args);
   */
  customCommands: object[];
  /**
   * The custom templates.
   * @type {object[]}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.customTemplates);
   * console.log(config.customTemplates[0].name);
   * console.log(config.customTemplates[0].description);
   * console.log(config.customTemplates[0].type);
   * console.log(config.customTemplates[0].template);
   */
  templates: object[];
  /**
   * Whether to show the menu or not.
   * @type {MenuInterface}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.activateItem);
   * console.log(config.activateItem.terminal.components);
   */
  activateItem: MenuInterface;
  /**
   * The auto import setting.
   * @type {boolean}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.autoImport);
   */
  autoImport: boolean;
  /**
   * Whether to skip the folder confirmation or not.
   * @type {boolean}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.skipFolderConfirmation);
   */
  skipFolderConfirmation: boolean;
  /**
   * The orm.
   * @type {string}
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * console.log(config.orm);
   */
  orm: string;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the Config class.
   *
   * @constructor
   * @param {WorkspaceConfiguration} config - The workspace configuration
   * @public
   * @memberof Config
   */
  constructor(readonly config: WorkspaceConfiguration) {
    this.enable = config.get<boolean>('enable', true);
    this.include = config.get<string[]>('files.include', INCLUDE);
    this.exclude = config.get<string[]>('files.exclude', EXCLUDE);
    this.watch = config.get<string[]>('files.watch', WATCH);
    this.showPath = config.get<boolean>('files.showPath', SHOW_PATH);
    this.cwd = config.get<string | undefined>(
      'terminal.cwd',
      workspace.workspaceFolders?.[0].uri.fsPath,
    );
    this.customCommands = config.get<object[]>(
      'submenu.customCommands',
      CUSTOM_COMMANDS,
    );
    this.templates = config.get<object[]>(
      'submenu.templates',
      CUSTOM_TEMPLATES,
    );
    this.activateItem = config.get<MenuInterface>(
      'submenu.activateItem',
      ACTIVATE_MENU,
    );
    this.autoImport = config.get<boolean>('files.autoImport', AUTO_IMPORT);
    this.skipFolderConfirmation = config.get<boolean>(
      'files.skipFolderConfirmation',
      SKIP_FOLDER_CONFIRMATION,
    );
    this.orm = config.get<string>('files.orm', ORM);
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * The update method.
   *
   * @function update
   * @param {WorkspaceConfiguration} config - The workspace configuration
   * @public
   * @memberof Config
   * @example
   * const config = new Config(workspace.getConfiguration());
   * config.update(workspace.getConfiguration());
   */
  update(config: WorkspaceConfiguration): void {
    this.enable = config.get<boolean>('enable', true);
    this.include = config.get<string[]>('files.include', INCLUDE);
    this.exclude = config.get<string[]>('files.exclude', EXCLUDE);
    this.watch = config.get<string[]>('files.watch', WATCH);
    this.showPath = config.get<boolean>('files.showPath', SHOW_PATH);
    this.cwd = config.get<string | undefined>(
      'terminal.cwd',
      workspace.workspaceFolders?.[0].uri.fsPath,
    );
    this.customCommands = config.get<object[]>(
      'submenu.customCommands',
      CUSTOM_COMMANDS,
    );
    this.templates = config.get<object[]>(
      'submenu.templates',
      CUSTOM_TEMPLATES,
    );
    this.activateItem = config.get<MenuInterface>(
      'submenu.activateItem',
      ACTIVATE_MENU,
    );
    this.autoImport = config.get<boolean>('files.autoImport', AUTO_IMPORT);
    this.skipFolderConfirmation = config.get<boolean>(
      'files.skipFolderConfirmation',
      SKIP_FOLDER_CONFIRMATION,
    );
    this.orm = config.get<string>('files.orm', ORM);
  }
}
