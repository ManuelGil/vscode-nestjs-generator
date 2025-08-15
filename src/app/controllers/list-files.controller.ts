import FastGlob from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import ignore from 'ignore';
import { join, relative } from 'path';
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

import { Config, EXTENSION_ID } from '../configs';
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
   * The static config property.
   *
   * @static
   * @property
   * @public
   * @type {Config}
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
  constructor(config: Config) {
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
   * @param {number} maxResults - The maximum number of results
   * @public
   * @async
   * @memberof ListFilesController
   * @example
   * controller.getFiles();
   *
   * @returns {Promise<NodeModel[] | void>} - The list of files
   */
  static async getFiles(): Promise<NodeModel[] | void> {
    // Get the files in the folder
    let folders: string[] = [];
    const files: Uri[] = [];

    if (!workspace.workspaceFolders) {
      window.showErrorMessage(l10n.t('Operation cancelled!'));
      return;
    }

    folders = workspace.workspaceFolders.map((folder) => folder.uri.fsPath);

    const { include, exclude } = this.config;

    // Normalize include entries (e.g., "ts" -> "**/*.ts"). If the entry already
    // contains glob characters or a path separator, use it as-is.
    const fileExtensionPattern = include
      .map((p) => p?.trim())
      .filter((p): p is string => !!p && p.length > 0)
      .map((p) => {
        const hasGlob = /[\*\?\[\]\{\}\(\)!]/.test(p);
        const hasSep = /[\\/]/.test(p);
        if (hasGlob || hasSep) {
          return p;
        }
        // Treat as file extension (allow optional leading dot)
        const ext = p.startsWith('.') ? p.slice(1) : p;
        return `**/*.${ext}`;
      });

    const fileExclusionPatterns = exclude;

    for (const folder of folders) {
      const result = await this.findFiles(
        folder,
        fileExtensionPattern,
        fileExclusionPatterns,
      );

      files.push(...result);
    }

    if (files.length !== 0) {
      let nodes: NodeModel[] = [];

      files.sort((a, b) => a.path.localeCompare(b.path));

      for (const file of files) {
        const path = workspace.asRelativePath(file);
        let filename = path.split('/').pop();

        if (filename && this.config.showPath) {
          const folder = path.split('/').slice(0, -1).join('/');

          filename += folder
            ? l10n.t(' ({0})', folder)
            : ` ${l10n.t('(root)')}`;
        }
        const node = new NodeModel(
          filename ?? l10n.t('Untitled'),
          new ThemeIcon('file'),
          {
            command: `${EXTENSION_ID}.list.openFile`,
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

    return;
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
  openFile(uri: Uri) {
    workspace.openTextDocument(uri).then((filename) => {
      window.showTextDocument(filename);
    });
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
  gotoLine(uri: Uri, line: number) {
    workspace.openTextDocument(uri).then((document) => {
      window.showTextDocument(document).then((editor) => {
        const position = new Position(line, 0);
        editor.revealRange(
          new Range(position, position),
          TextEditorRevealType.InCenterIfOutsideViewport,
        );
        editor.selection = new Selection(position, position);
      });
    });
  }

  // Private methods
  /**
   * The findFiles method.
   *
   * @function findFiles
   * @param {string} baseDir - The base directory
   * @param {string[]} include - The include pattern
   * @param {string[]} exclude - The exclude pattern
   * @private
   * @async
   * @memberof FilesController
   * @example
   * controller.findFiles('baseDir', ['include'], ['exclude']);
   *
   * @returns {Promise<Uri[]>} - The promise with the files
   */
  private static async findFiles(
    baseDir: string,
    includeFilePatterns: string[],
    excludedPatterns: string[] = [],
    deep: number = 0,
    includeDotfiles: boolean = false,
    enableGitignoreDetection: boolean = false,
    disableRecursive: boolean = false,
  ): Promise<Uri[]> {
    try {
      // Check if any include patterns were provided
      if (!includeFilePatterns.length) {
        return [];
      }

      // If we need to respect .gitignore, we need to load it
      let gitignore;
      if (enableGitignoreDetection) {
        const gitignorePath = join(baseDir, '.gitignore');
        // Load .gitignore if it exists
        if (existsSync(gitignorePath)) {
          gitignore = ignore().add(readFileSync(gitignorePath, 'utf8'));
        }
      }

      // Configure fast-glob options with optimizations for large projects
      const options = {
        cwd: baseDir, // Set the base directory for searching
        absolute: true, // Return absolute paths for files found
        onlyFiles: true, // Match only files, not directories
        dot: includeDotfiles, // Include the files and directories starting with a dot
        deep: disableRecursive ? 1 : deep === 0 ? undefined : deep, // Set the recursion depth
        ignore: excludedPatterns, // Set the patterns to ignore files and directories
        followSymbolicLinks: false, // Don't follow symlinks for better performance
        cache: true, // Enable cache for better performance in large projects
        stats: false, // Don't return stats objects for better performance
        throwErrorOnBrokenSymbolicLink: false, // Don't throw on broken symlinks
        objectMode: false, // Use string mode for better performance
      };

      // Use fast-glob to find matching files
      let foundFilePaths = await FastGlob(includeFilePatterns, options);

      // Apply gitignore filtering if needed
      if (gitignore) {
        foundFilePaths = foundFilePaths.filter(
          (filePath: string) => !gitignore.ignores(relative(baseDir, filePath)),
        );
      }

      // Convert file paths to VS Code Uri objects
      return foundFilePaths
        .sort()
        .map((filePath: string) => Uri.file(filePath));
    } catch (error) {
      const errorDetails =
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : { message: String(error) };

      window.showErrorMessage(
        l10n.t('Error finding files: {0}', errorDetails.message),
      );

      return [];
    }
  }
}
