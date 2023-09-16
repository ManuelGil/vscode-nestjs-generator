import {
  getClass,
  getFolder,
  parsePath,
  save,
  toKebabCase,
} from '../../utils/functions';

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

const newService = async (
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
    'Service class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Service') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/service/gi, '');

  const body = content
    .replace(/\{className\}/g, className)
    .replace(/\{entityName\}/g, toKebabCase(className));

  const filename = '/' + folder + toKebabCase(className) + '.service.ts';

  save(vscode, fs, path, filename, body);
};

export { newService };
