import { save } from './functions';

const content = `import { Create{className}Dto } from './create-{entityName}.dto';

export class Update{className}Dto extends PartialType(Create{className}Dto) {
  name: string;
  age: number;
}
`;

let folder: string = '';
let name: string = '';
let filename: string = '';
let body: string = '';

const dto = async (vscode: any, fs: any, path: any) => {
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
    prompt: 'Dto class name',
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

  if (name === 'Dto') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  name = name.replace('Dto', '');

  body = content.replace(/\{className\}/g, name);

  name = name
    .replace(/[A-Z]/g, (letter) => `-${letter}`)
    .slice(1)
    .toLowerCase();

  body = body.replace(/\{entityName\}/g, name);

  folder = folder.endsWith('/') ? folder : folder + '/';
  filename = '/' + folder + 'update-' + name + '.dto.ts';

  save(vscode, fs, path, filename, body);
};

export default dto;
