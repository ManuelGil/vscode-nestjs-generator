import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class {className}Middleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
`;

const newMiddleware = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  let className = await getClass(
    vscode,
    'Middleware class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Middleware') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/middleware/gi, '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.middleware.ts';

  save(vscode, fs, path, filename, body);
};

export { newMiddleware };
