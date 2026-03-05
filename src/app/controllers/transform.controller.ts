/**
 * @file Converts selected JSON text in the active editor into TypeScript
 * interfaces using the `json-to-ts` library. Supports JSON5 and relaxed
 * JS-object syntax from JS/TS files.
 *
 * @module controllers/transform
 */
import JsonToTS from 'json-to-ts';
import json5 from 'json5';
import { l10n, Range, TextEditor, window, workspace } from 'vscode';

import { showError } from '../helpers';

/**
 * Transforms JSON data into TypeScript interface definitions.
 *
 * @class
 * @export
 * @public
 */
export class TransformController {
  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Reads the current text selection, parses it as JSON (or JS-object literal),
   * and opens a new editor tab with the generated TypeScript interfaces.
   *
   * @function json2ts
   * @public
   * @async
   * @memberof TransformController
   *
   * @returns {Promise<TextEditor | void>} The editor showing the generated interfaces, or void on error.
   */
  async json2ts(): Promise<TextEditor | void> {
    let editor;

    if (workspace.workspaceFolders) {
      editor = window.activeTextEditor;
    } else {
      const message = l10n.t('No text editor is active!');
      showError(message);
      return;
    }

    if (!editor) {
      const message = l10n.t('No text editor is active!');
      showError(message);
      return;
    }

    const selection = editor.selection;

    if (selection && !selection.isEmpty) {
      const selectionRange = new Range(
        selection.start.line,
        selection.start.character,
        selection.end.line,
        selection.end.character,
      );

      let text = editor.document.getText(selectionRange) || '';

      const languageId = editor.document.languageId || '';

      if (
        [
          'javascript',
          'javascriptreact',
          'typescript',
          'typescriptreact',
        ].includes(languageId)
      ) {
        text = text
          .replace(/'([^']+)'/g, '"$1"')
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
          .replace(/,*\s*\n*\];*/g, ']')
          .replace(/{\s*\n*/g, '{')
          .replace(/,*\s*\n*};*/g, '}');
      }

      const jsonSchema = this.tryParseJSONObject(text);

      if (!jsonSchema) {
        const message = l10n.t('Invalid JSON Schema!');
        showError(message);
        return;
      }

      const tsSchema = JsonToTS(jsonSchema)
        .map((itf) => `export ${itf}\n`)
        .join('\n');

      const document = await workspace.openTextDocument({
        language: 'typescript',
        content: tsSchema,
      });

      return await window.showTextDocument(document);
    }

    const message = l10n.t('No text is selected!');
    showError(message);
    return;
  }

  // Private methods
  /**
   * Attempts to parse a string as JSON5. Returns the parsed object on success
   * or `false` if the string is not valid JSON.
   *
   * @private
   * @memberof TransformController
   * @param {string} str - The string to parse
   * @returns {object | false} The parsed object, or `false` on failure.
   */
  private tryParseJSONObject(str: string): boolean | object {
    try {
      const object = json5.parse(str);

      if (object && typeof object === 'object') {
        return object;
      }
    } catch (e) {
      return false;
    }

    return false;
  }
}
