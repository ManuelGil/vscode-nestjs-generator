/**
 * @file VSCode extension entry point for the NestJS File Generator.
 *
 * Exports the {@link activate} and {@link deactivate} lifecycle hooks required
 * by the VSCode extension API. All initialization logic is delegated to
 * {@link ExtensionRuntime}.
 */
import * as vscode from 'vscode';

import { EXTENSION_DISPLAY_NAME } from './app/configs';
import { ExtensionRuntime } from './extension.runtime';

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  try {
    const runtime = new ExtensionRuntime(context);

    const initialized = await runtime.initialize();

    if (!initialized) {
      return;
    }

    runtime.start();
  } catch (error) {
    const message = vscode.l10n.t(
      'Failed to activate {0}: {1}',
      EXTENSION_DISPLAY_NAME,
      error instanceof Error ? error.message : String(error),
    );
    vscode.window.showErrorMessage(message);
    console.error('Extension activation error:', error);
  }
}

export function deactivate() {}
