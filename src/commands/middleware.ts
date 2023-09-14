import { save } from './functions';

const content = `import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class {className}Middleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
`;

let folder: string = '';
let name: string = '';
let filename: string = '';
let body: string = '';

const middleware = async (vscode: any, fs: any, path: any) => {
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
    prompt: 'Middleware class name',
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

  if (name === 'Middleware') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  name = name.replace('Middleware', '');

  body = content.replace(/\{className\}/g, name);

  name = name
    .replace(/[A-Z]/g, (letter) => `-${letter}`)
    .slice(1)
    .toLowerCase();

  folder = folder.endsWith('/') ? folder : folder + '/';
  filename = '/' + folder + name + '.middleware.ts';

  save(vscode, fs, path, filename, body);
};

export default middleware;
