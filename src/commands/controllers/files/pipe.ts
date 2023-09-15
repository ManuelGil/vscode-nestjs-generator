import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class {className}Pipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
`;

const newPipe = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  const className = await getClass(
    vscode,
    'Pipe class name',
    'E.g. User, Role, Auth...',
  );

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.pipe.ts';

  save(vscode, fs, path, filename, body);
};

export { newPipe };
