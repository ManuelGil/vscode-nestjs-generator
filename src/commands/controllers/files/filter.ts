import {
  getClass,
  getFolder,
  parsePath,
  save,
  toKebabCase,
} from '../../utils/functions';

const content = `import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class {className}Filter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
`;

const newFilter = async (vscode: any, fs: any, path: any, args: any = null) => {
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
    'Filter class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Filter') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/filter/gi, '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.filter.ts';

  save(vscode, fs, path, filename, body);
};

export { newFilter };
