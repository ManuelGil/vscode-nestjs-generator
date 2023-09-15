import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { PartialType } from '@nestjs/mapped-types';
import { Create{className}Dto } from './create-{entityName}.dto';

export class Update{className}Dto extends PartialType(Create{className}Dto) {
  name: string;
  age: number;
}
`;

const newDto = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  let className = await getClass(
    vscode,
    'Dto class name',
    'E.g. User, Role, Auth...',
  );

  const body = content
    .replace(/\{className\}/g, className)
    .replace(/\{entityName\}/g, toKebabCase(className));

  const filename =
    '/' + folder + 'update-' + toKebabCase(className) + '.dto.ts';

  save(vscode, fs, path, filename, body);
};

export { newDto };
