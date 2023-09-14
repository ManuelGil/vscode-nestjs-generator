import { save } from './functions';

const content = `import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: []
})
export class {className}Module {}
`;

let folder: string = '';
let name: string = '';
let filename: string = '';
let body: string = '';

const moduleType = async (vscode: any, fs: any, path: any) => {
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
    prompt: 'Module class name',
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

  if (name === 'Module') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  name = name.replace('Module', '');

  body = content.replace(/\{className\}/g, name);

  name = name
    .replace(/[A-Z]/g, (letter) => `-${letter}`)
    .slice(1)
    .toLowerCase();

  folder = folder.endsWith('/') ? folder : folder + '/';
  filename = '/' + folder + name + '.module.ts';

  save(vscode, fs, path, filename, body);
};

export default moduleType;
