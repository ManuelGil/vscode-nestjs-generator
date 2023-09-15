import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class {className}Guard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
`;

const newGuard = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  let className = await getClass(
    vscode,
    'Guard class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Guard') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/guard/gi, '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.guard.ts';

  save(vscode, fs, path, filename, body);
};

export { newGuard };
