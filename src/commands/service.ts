import { save } from './functions';

const content = `import { Injectable } from '@nestjs/common';
import { Create{className}Dto } from './dto/create-{entityName}.dto';
import { Update{className}Dto } from './dto/update-{entityName}.dto';

@Injectable()
export class {className}Service {
  create(create{className}Dto: Create{className}Dto) {
    return 'This action adds a new {entityName}';
  }

  findAll() {
    return \`This action returns all {entityName}s\`;
  }

  findOne(id: number) {
    return \`This action returns a #id {entityName}\`;
  }

  update(id: number, update{className}Dto: Update{className}Dto) {
    return \`This action updates a #id {entityName}\`;
  }

  remove(id: number) {
    return \`This action removes a #id {entityName}\`;
  }
}
`;

let folder: string = '';
let name: string = '';
let filename: string = '';
let body: string = '';

const service = async (vscode: any, fs: any, path: any) => {
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
    prompt: 'Service class name',
    placeHolder: 'Plural. E.g. Users, Roles...',
    validateInput: (text: string) => {
      if (!/^[A-Z][A-Za-z]{2,}$/.test(text)) {
        return 'Invalid format! Class names MUST be declared in PascalCase.';
      }
    },
  });

  if (name.length === 0) {
    return;
  }

  if (name === 'Service') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  name = name.replace('Service', '');

  body = content.replace(/\{className\}/g, name);

  name = name
    .replace(/[A-Z]/g, (letter) => `-${letter}`)
    .slice(1)
    .toLowerCase();

  body = body.replace(/\{entityName\}/g, name);

  folder = folder.endsWith('/') ? folder : folder + '/';
  filename = '/' + folder + name + '.service.ts';

  save(vscode, fs, path, filename, body);
};

export default service;
