import { normalize } from 'path';
import { ProgressLocation, Uri, l10n, window, workspace } from 'vscode';

/**
 * Writes data to the file specified in the path. If the file does not exist then the function will create it.
 *
 * @param {string} path - Path to the file
 * @param {string} filename - Name of the file
 * @param {string} data - Data to write to the file
 * @example
 * await saveFile('src', 'file.ts', 'console.log("Hello World")');
 *
 * @returns {Promise<void>} - Confirmation of the write operation
 */
export const saveFile = async (
  directoryPath: string,
  filename: string,
  fileContent: string,
): Promise<void> => {
  let folder: string = '';

  if (workspace.workspaceFolders) {
    folder = workspace.workspaceFolders[0].uri.fsPath;
  } else {
    const message = l10n.t('The file has not been created!');
    window.showErrorMessage(message);
    return;
  }

  const dirUri = Uri.joinPath(Uri.file(folder), directoryPath);
  const fileUri = Uri.joinPath(dirUri, filename);

  await window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: l10n.t('Creating file: {0}', filename),
      cancellable: true,
    },
    async (_progress, token) => {
      if (token.isCancellationRequested) {
        window.showWarningMessage(
          l10n.t('Cancelled creating file: {0}', filename),
        );
        return;
      }
      try {
        await workspace.fs.createDirectory(dirUri);

        let alreadyExists = false;

        try {
          await workspace.fs.stat(fileUri);
          alreadyExists = true;
        } catch (statError: any) {
          if ((statError as { code?: string }).code !== 'FileNotFound') {
            throw statError;
          }
        }

        if (alreadyExists) {
          const choice = await window.showWarningMessage(
            l10n.t('File already exists: {0}. Overwrite?', filename),
            { modal: true },
            l10n.t('Overwrite'),
            l10n.t('Cancel'),
          );
          if (choice !== l10n.t('Overwrite')) {
            window.showInformationMessage(l10n.t('Operation cancelled.'));
            return;
          }
        }

        // React to cancellation during I/O
        const cancelDisposable = token.onCancellationRequested(() => {
          window.showWarningMessage(
            l10n.t('Cancelled creating file: {0}', filename),
          );
        });

        const encoded = Buffer.from(fileContent, 'utf8');
        await workspace.fs.writeFile(fileUri, encoded);

        const document = await workspace.openTextDocument(fileUri);
        await window.showTextDocument(document);

        // Ensure the directory exists
        const message = l10n.t(
          'File created successfully: {0}',
          normalize(fileUri.fsPath),
        );
        window.showInformationMessage(message);

        cancelDisposable.dispose();
      } catch (err: any) {
        // Handle errors during file creation
        const message = l10n.t(
          'Error creating file: {0}. Please check the path and try again.',
          err.message ?? err,
        );
        window.showErrorMessage(message);
      }
    },
  );
};
