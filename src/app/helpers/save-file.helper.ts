/**
 * @fileoverview Safely writes generated file content to disk within the workspace.
 * Handles directory creation, path validation against directory-traversal attacks,
 * duplicate detection, progress/cancellation UI, and post-creation cache invalidation.
 */

import { isAbsolute, normalize } from 'path';
import {
  FileSystemError,
  l10n,
  ProgressLocation,
  Uri,
  window,
  workspace,
} from 'vscode';

import { Config, EXTENSION_DISPLAY_NAME } from '../configs';
import { clearCache } from './find-files.helper';
import { getWorkspaceRoot } from './workspace-root.helper';

/**
 * Writes data to the file specified in the path. If the file does not exist then the function will create it.
 *
 * @param {string} directoryPath - Relative path (from the workspace folder) where the file will be created
 * @param {string} filename - Name of the file
 * @param {string} fileContent - Data to write to the file
 * @example
 * await saveFile('src', 'file.ts', 'console.log("Hello World")');
 *
 * @returns {Promise<void>} - Confirmation of the write operation
 */
export const saveFile = async (
  directoryPath: string,
  filename: string,
  fileContent: string,
  config: Config,
): Promise<void> => {
  const workspaceRoot = getWorkspaceRoot(config);

  if (!workspaceRoot) {
    const message = l10n.t(
      '{0}: No workspace folders are open. Please open a workspace folder to use this extension',
      EXTENSION_DISPLAY_NAME,
    );
    await window.showErrorMessage(message);
    return;
  }

  // Path validation: prevent directory-traversal attacks that could write files
  // outside the workspace. Absolute paths (e.g. "/etc/passwd") and ".." segments
  // (e.g. "../../outside") are both rejected to ensure all writes stay within
  // the workspace root boundary.
  const normalizedRelativeDirectoryPath = normalize(directoryPath || '.');
  if (
    isAbsolute(normalizedRelativeDirectoryPath) ||
    normalizedRelativeDirectoryPath.split(/[\\\/]/).includes('..')
  ) {
    await window.showErrorMessage(l10n.t('Invalid directory path'));
    return;
  }

  const relativePathSegments = normalizedRelativeDirectoryPath
    .split(/[\\/]+/)
    .filter((s) => s !== '' && s !== '.');

  // Second traversal check after segment splitting — guards against edge cases
  // where normalize() may leave ".." intact on certain platforms.
  if (relativePathSegments.includes('..')) {
    await window.showErrorMessage(l10n.t('Invalid directory path'));
    return;
  }

  const workspaceRootUri = Uri.file(workspaceRoot);

  // Build directory and file URIs using segments to ensure proper joining on all platforms
  const targetDirectoryUri =
    relativePathSegments.length > 0
      ? Uri.joinPath(workspaceRootUri, ...relativePathSegments)
      : workspaceRootUri;
  const targetFileUri = Uri.joinPath(targetDirectoryUri, filename);

  // Track success to show notification after progress completes
  let createdFileFsPath: string | undefined;

  try {
    await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: l10n.t('Creating file: {0}', filename),
        cancellable: true,
      },
      async (_progress, cancellationToken) => {
        try {
          // If the user cancelled immediately, stop.
          if (cancellationToken.isCancellationRequested) {
            return;
          }

          // Create the directory only if it's not the workspace root (no-op if it already exists).
          if (targetDirectoryUri.toString() !== workspaceRootUri.toString()) {
            await workspace.fs.createDirectory(targetDirectoryUri);
          }

          // Check if file exists. Treat FileSystemError from stat as "not exists".
          let targetFileExists = false;
          try {
            await workspace.fs.stat(targetFileUri);
            targetFileExists = true;
          } catch (error: unknown) {
            if (error instanceof FileSystemError) {
              targetFileExists = false;
            } else {
              // Unknown error - rethrow so outer catch can show it
              throw error;
            }
          }

          if (cancellationToken.isCancellationRequested) {
            return;
          }

          // If file exists, offer to open it instead of overwriting
          if (targetFileExists) {
            const openLabel = l10n.t('Open File');
            const choice = await window.showWarningMessage(
              l10n.t('File already exists: {0}', filename),
              openLabel,
            );
            if (choice === openLabel) {
              const textDocument =
                await workspace.openTextDocument(targetFileUri);
              await window.showTextDocument(textDocument);
            }
            return;
          }

          // Write file contents (TextEncoder -> Uint8Array)
          const encodedFileContent = new TextEncoder().encode(fileContent);
          await workspace.fs.writeFile(targetFileUri, encodedFileContent);

          if (cancellationToken.isCancellationRequested) {
            return;
          }

          // Open the created file in the editor
          const createdTextDocument =
            await workspace.openTextDocument(targetFileUri);
          await window.showTextDocument(createdTextDocument);

          // Mark success; show notification after progress resolves
          createdFileFsPath = targetFileUri.fsPath;

          // Clear the file cache since a new file was created
          clearCache();
        } catch (error: any) {
          // Show a helpful error message including the underlying error if available
          await window.showErrorMessage(
            l10n.t(
              'Error creating file: {0}. Please check the path and try again',
              error?.message ?? String(error),
            ),
          );
        }
      },
    );
    // Show success notification after progress dialog closes
    if (createdFileFsPath) {
      await window.showInformationMessage(
        l10n.t('File created successfully: {0}', createdFileFsPath),
      );
    }
  } catch (error: any) {
    // Catch failures from withProgress or other unexpected issues
    await window.showErrorMessage(
      l10n.t(
        'Error creating file: {0}. Please check the path and try again',
        error?.message ?? String(error),
      ),
    );
  }
};
