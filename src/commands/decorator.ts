import { save } from './functions';

const content = `import { SetMetadata } from '@nestjs/common';

export const {entityName} = (...args: string[]) =>
  SetMetadata('{entityName}-decorator', args);
`;

let folder: string = '';
let name: string = '';
let filename: string = '';
let body: string = '';

const decorator = async (vscode: any, fs: any, path: any) => {
  folder = await vscode.window.showInputBox({
    prompt: 'Folder name',
    placeHolder: 'Folder name. E.g. src, app...',
    validateInput: (text: string) => {
      if (!/^[A-Za-z][\w\s\/-]+$/.test(text)) {
        return 'Invalid format!';
      }
    },
  });

  name = await vscode.window.showInputBox({
    prompt: 'Decorator class name',
    placeHolder: 'E.g. user, role, auth...',
    validateInput: (text: string) => {
      if (!/^[A-Za-z]{3,}$/.test(text)) {
        return 'Invalid format!';
      }
    },
  });

  if (name.length === 0) {
    return;
  }

  if (name === 'Decorator') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  name = name.toLowerCase();
  body = content.replace(/\{entityName\}/g, name);

  folder = folder.endsWith('/') ? folder : folder + '/';
  filename = '/' + folder + name + '.decorator.ts';

  save(vscode, fs, path, filename, body);
};

export default decorator;
