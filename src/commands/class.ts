import { save } from './functions';

const content = `export class {className} {}
`;

let folder: string = '';
let name: string = '';
let filename: string = '';
let type: string = '';
let body: string = '';

const classType = async (vscode: any, fs: any, path: any) => {
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
    prompt: 'Class name',
    placeHolder: 'E.g. User, Role, Auth...',
    validateInput: (text: string) => {
      if (!/^[A-Z][A-Za-z]{2,}$/.test(text)) {
        return 'Invalid format! Class names MUST be declared in PascalCase.';
      }
    },
  });

  if (name.length === 0) {
    return;
  }

  type = await vscode.window.showInputBox({
    prompt: 'Type class name',
    placeHolder: 'E.g. class, dto, entity, model...',
  });

  if (type.length !== 0) {
    type = '.' + type;
  }

  body = content.replace(/\{className\}/g, name);

  name = name
    .replace(/[A-Z]/g, (letter) => `-${letter}`)
    .slice(1)
    .toLowerCase();

  folder = folder.endsWith('/') ? folder : folder + '/';
  filename = '/' + folder + name + type + '.ts';

  save(vscode, fs, path, filename, body);
};

export default classType;
