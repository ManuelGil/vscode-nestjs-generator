import {
  l10n,
  Position,
  Range,
  Selection,
  TextEditorRevealType,
  ThemeIcon,
  Uri,
  window,
  workspace,
} from 'vscode';

import { CommandIds, Config, EXTENSION_ID } from '../configs';
import { clearCache, findFiles, showError } from '../helpers';
import { NodeModel } from '../models';

/**
 * The ListFilesController class.
 *
 * @class
 * @classdesc The class that represents the list files controller.
 * @export
 * @public
 * @example
 * const controller = new ListFilesController();
 */
export class ListFilesController {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /**
   * The configuration object
   * @type {Config}
   * @static
   * @public
   * @memberof ListFilesController
   */
  static config: Config;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ListFilesController class
   *
   * @constructor
   * @param {Config} config - The configuration object
   * @public
   * @memberof ListFilesController
   */
  constructor(private readonly config: Config) {
    ListFilesController.config = config;
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * The getFiles method.
   *
   * @function getFiles
   * @public
   * @static
   * @async
   * @memberof ListFilesController
   * @example
   * ListFilesController.getFiles();
   *
   * @returns {Promise<NodeModel[]>} - The list of files
   */
  static async getFiles(): Promise<NodeModel[]> {
    // Get the files in the folder
    let folders: string[] = [];
    const files: Uri[] = [];

    if (!workspace.workspaceFolders) {
      showError(l10n.t('Operation cancelled!'));
      return [];
    }

    folders = workspace.workspaceFolders.map((folder) => folder.uri.fsPath);

    const { include, exclude } = ListFilesController.config;

    // Normalize include entries (e.g., "ts" -> "**/*.ts"). If the entry already
    // contains glob characters or a path separator, use it as-is.
    const fileExtensionPattern = include
      .map((pattern) => pattern?.trim())
      .filter((pattern): pattern is string => !!pattern && pattern.length > 0)
      .map((pattern) => {
        const hasGlob = /[\*\?\[\]\{\}\(\)!]/.test(pattern);
        const hasSep = /[\\/]/.test(pattern);
        if (hasGlob || hasSep) {
          return pattern;
        }
        // Treat as file extension (allow optional leading dot)
        const ext = pattern.startsWith('.') ? pattern.slice(1) : pattern;
        return `**/*.${ext}`;
      });

    const fileExclusionPatterns = exclude;

    for (const folder of folders) {
      const result = await findFiles({
        baseDirectoryPath: folder,
        includeFilePatterns: fileExtensionPattern,
        excludedPatterns: fileExclusionPatterns,
        includeDotfiles: false, // includeDotfiles
        enableGitignoreDetection: true, // enableGitignoreDetection
      });

      files.push(...result);
    }

    if (files.length !== 0) {
      let nodes: NodeModel[] = [];

      files.sort((a, b) => a.path.localeCompare(b.path));

      for (const file of files) {
        const path = workspace.asRelativePath(file);
        let filename = path.split('/').pop();

        if (filename && ListFilesController.config.showPath) {
          const folder = path.split('/').slice(0, -1).join('/');

          filename += folder
            ? l10n.t(' ({0})', folder)
            : ` ${l10n.t('(root)')}`;
        }
        const node = new NodeModel(
          filename ?? l10n.t('Untitled'),
          new ThemeIcon('file'),
          {
            command: `${EXTENSION_ID}.${CommandIds.ListOpenFile}`,
            title: l10n.t('Open File'),
            arguments: [file],
          },
          file,
          file.fsPath,
        );
        node.tooltip = file.fsPath;
        nodes.push(node);
      }

      return nodes;
    }

    return [];
  }

  /**
   * Clears the shared file cache.
   * Should be called when files are created, deleted, or modified.
   *
   * @function clearFileCache
   * @public
   * @static
   * @memberof ListFilesController
   * @example
   * ListFilesController.clearFileCache();
   *
   * @returns {void} - No return value
   */
  static clearFileCache(): void {
    clearCache();
  }

  /**
   * The openFile method.
   *
   * @function openFile
   * @param {Uri} uri - The file URI
   * @public
   * @memberof ListFilesController
   * @example
   * controller.openFile('file:///path/to/file');
   *
   * @returns {Promise<void>} - The promise
   */
  async openFile(uri: Uri): Promise<void> {
    try {
      const document = await workspace.openTextDocument(uri);
      await window.showTextDocument(document);
    } catch (error: unknown) {
      console.error('Error opening file:', error);
      showError(l10n.t('Failed to open file'));
    }
  }

  /**
   * The gotoLine method.
   *
   * @function gotoLine
   * @param {Uri} uri - The file URI
   * @param {number} line - The line number
   * @public
   * @memberof ListFilesController
   * @example
   * controller.gotoLine('file:///path/to/file', 1);
   *
   * @returns {void} - The promise
   */
  async gotoLine(uri: Uri, line: number): Promise<void> {
    try {
      const document = await workspace.openTextDocument(uri);
      const editor = await window.showTextDocument(document);
      const targetPosition = new Position(line, 0);
      editor.revealRange(
        new Range(targetPosition, targetPosition),
        TextEditorRevealType.InCenterIfOutsideViewport,
      );
      editor.selection = new Selection(targetPosition, targetPosition);
    } catch (error: unknown) {
      console.error('Error navigating to line:', error);
      showError(l10n.t('Failed to go to line'));
    }
  }
}
