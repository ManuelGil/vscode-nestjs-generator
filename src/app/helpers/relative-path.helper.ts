/**
 * @fileoverview Converts absolute URIs into workspace-relative paths.
 * Used by controllers when a user right-clicks a file or folder in the
 * explorer so the extension can determine the target directory for
 * file generation.
 */

import { statSync } from 'fs';
import { relative, resolve } from 'path';
import { Uri, workspace } from 'vscode';

import { Config } from '../configs';
import { getWorkspaceRoot } from './workspace-root.helper';

/**
 * Converts a URI to a workspace-relative directory path.
 *
 * If the URI points to a file, it automatically resolves to the parent
 * directory so callers always receive a folder path.
 *
 * Supports two resolution modes controlled by `isRootContext`:
 * - **Root context** (`true`): computes a POSIX-style relative path from
 *   `config.workspaceRoot` using Node's `path.relative`. Used when the
 *   extension needs paths relative to the user-selected workspace root
 *   (e.g., for file generation commands).
 * - **Standard** (`false`): delegates to VSCode's `workspace.asRelativePath`,
 *   which resolves relative to the nearest workspace folder. Used for
 *   display purposes and multi-root workspace scenarios.
 *
 * @param {Uri} [path] - The URI to convert. When `undefined`, returns an empty string.
 * @param {boolean} isRootContext - Selects the resolution mode (see above).
 * @param {Config} config - The extension configuration instance.
 * @returns {string} The workspace-relative directory path, or empty string
 *   when no path is provided.
 */
export const relativePath = (
  path: Uri | undefined,
  isRootContext: boolean,
  config: Config,
): string => {
  if (path && statSync(path.fsPath).isFile()) {
    path = Uri.file(resolve(path.fsPath, '..'));
  }

  let folderPath: string = '';

  if (isRootContext) {
    const workspaceRoot = getWorkspaceRoot(config);
    if (workspaceRoot && path) {
      folderPath = relative(workspaceRoot, path.fsPath);
    }
  } else {
    folderPath = path ? workspace.asRelativePath(path.fsPath, false) : '';
  }

  return folderPath;
};
