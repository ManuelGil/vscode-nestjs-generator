import {
  getClass,
  getFolder,
  parsePath,
  save,
  toKebabCase,
} from '../../utils/functions';

const content = `import { HttpException } from '@nestjs/common';

export class {className}Exception extends HttpException {
  constructor() {
    super('{className}Exception', );
  }
}
`;

const newException = async (
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
    'Exception class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Exception') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/exception/gi, '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.exception.ts';

  save(vscode, fs, path, filename, body);
};

export { newException };
