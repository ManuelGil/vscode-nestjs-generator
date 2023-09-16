import {
  getClass,
  getFolder,
  parsePath,
  save,
  toKebabCase,
} from '../../utils/functions';

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

const newController = async (
  vscode: any,
  fs: any,
  path: any,
  args: any = null,
) => {
  let relativePath = '';

  if (args) {
    relativePath = parsePath(vscode, path, args);
  }

  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
    relativePath,
  );

  let className = await getClass(
    vscode,
    'Controller class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Controller') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/controller/gi, '');

  const body = content
    .replace(/\{className\}/g, className)
    .replace(/\{entityName\}/g, toKebabCase(className));

  const filename = '/' + folder + toKebabCase(className) + '.controller.ts';

  save(vscode, fs, path, filename, body);
};

export { newController };
