/**
 * @file Typed configuration wrapper for the NestJS File Generator extension.
 *
 * Reads values from VSCode's {@link WorkspaceConfiguration} and exposes them
 * as strongly-typed properties with sensible defaults from `constants.ts`.
 * Supports live-reload via {@link Config.update}.
 */
import { WorkspaceConfiguration, workspace } from 'vscode';

import {
  ACTIVATE_MENU,
  AUTO_IMPORT,
  CUSTOM_COMMANDS,
  CUSTOM_TEMPLATES,
  EXCLUDE,
  INCLUDE,
  IS_ROOT_CONTEXT,
  MenuInterface,
  ORM,
  SHOW_PATH,
  SKIP_FOLDER_CONFIRMATION,
  WATCH,
} from './constants';

/**
 * Wraps {@link WorkspaceConfiguration} to provide typed access to all
 * extension settings, falling back to the defaults defined in `constants.ts`.
 */
export class Config {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  /** Whether the extension is enabled. */
  enable!: boolean;
  /** File extensions to include when scanning the workspace. */
  include!: string[];
  /** Glob patterns to exclude from workspace scans. */
  exclude!: string[];
  /** File categories to watch for changes. */
  watch!: string[];
  /** Whether to show relative paths in tree-view items. */
  showPath!: boolean;
  /** Working directory override for terminal commands. */
  cwd!: string | undefined;
  /** User-defined custom terminal command templates. */
  customCommands!: object[];
  /** User-defined custom file templates for boilerplate generation. */
  templates!: object[];
  /** Controls which file/terminal menu items are visible. */
  activateItem!: MenuInterface;
  /** Whether to auto-import generated files into the nearest module. */
  autoImport!: boolean;
  /** Whether to resolve relative paths from the workspace root. */
  useRootWorkspace!: boolean;
  /** Whether to skip the folder selection confirmation dialog. */
  skipFolderConfirmation!: boolean;
  /** ORM used for entity/DTO generation (e.g. 'typeorm', 'sequelize'). */
  orm!: string;
  /**
   * Resolved workspace root path.
   * Set externally from the selected workspace folder stored in global state.
   */
  workspaceRoot?: string;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * @param config - The scoped workspace configuration to read settings from.
   */
  constructor(readonly config: WorkspaceConfiguration) {
    this.loadConfiguration(config);
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  /**
   * Reloads all settings from a (possibly updated) workspace configuration.
   * Called when the user changes settings or switches workspace folders.
   */
  update(config: WorkspaceConfiguration): void {
    this.loadConfiguration(config);
  }

  /**
   * Maps each configuration key to its corresponding property,
   * using the default constants as fallback values.
   */
  private loadConfiguration(config: WorkspaceConfiguration): void {
    this.enable = config.get<boolean>('enable', true);
    this.include = config.get<string[]>('files.include', INCLUDE);
    this.exclude = config.get<string[]>('files.exclude', EXCLUDE);
    this.watch = config.get<string[]>('files.watch', WATCH);
    this.showPath = config.get<boolean>('files.showPath', SHOW_PATH);
    this.cwd = config.get<string | undefined>(
      'terminal.cwd',
      workspace.workspaceFolders?.[0]?.uri.fsPath,
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
    this.useRootWorkspace = config.get<boolean>(
      'fileGenerator.useRootWorkspace',
      IS_ROOT_CONTEXT,
    );
    this.skipFolderConfirmation = config.get<boolean>(
      'files.skipFolderConfirmation',
      SKIP_FOLDER_CONFIRMATION,
    );
    this.orm = config.get<string>('files.orm', ORM);
  }
}
