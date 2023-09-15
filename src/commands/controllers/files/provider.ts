import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { Injectable } from '@nestjs/common';

@Injectable()
export class {className} {}
`;

const newProvider = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  let className = await getClass(
    vscode,
    'Provider class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Provider') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/provider/gi, '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.provider.ts';

  save(vscode, fs, path, filename, body);
};

export { newProvider };
