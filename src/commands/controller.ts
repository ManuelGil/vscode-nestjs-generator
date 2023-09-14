import { save } from './functions';

const content = `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Create{className}Dto } from './dto/create-{entityName}.dto';
import { Update{className}Dto } from './dto/update-{entityName}.dto';
import { {className}Service } from './{entityName}.service';

@Controller('{entityName}s')
export class {className}Controller {
  constructor(private readonly {entityName}Service: {className}Service) {}

  @Post()
  create(@Body() create{className}Dto: Create{className}Dto) {
    return this.{entityName}Service.create(create{className}Dto);
  }

  @Get()
  findAll() {
    return this.{entityName}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.{entityName}Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update{className}Dto: Update{className}Dto) {
    return this.{entityName}Service.update(+id, update{className}Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.{entityName}Service.remove(+id);
  }
}
`;

let folder: string = '';
let name: string = '';
let filename: string = '';
let body: string = '';

const controller = async (vscode: any, fs: any, path: any) => {
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
    prompt: 'Controller class name',
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

  if (name === 'Controller') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  name = name.replace('Controller', '');

  body = content.replace(/\{className\}/g, name);

  name = name
    .replace(/[A-Z]/g, (letter) => `-${letter}`)
    .slice(1)
    .toLowerCase();

  body = body.replace(/\{entityName\}/g, name);

  folder = folder.endsWith('/') ? folder : folder + '/';
  filename = '/' + folder + name + '.controller.ts';

  save(vscode, fs, path, filename, body);
};

export default controller;
