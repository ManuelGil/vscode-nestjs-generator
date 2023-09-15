import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class {className}Guard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
`;

const newJwtGuard = async (vscode: any, fs: any, path: any) => {
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

  className = className.replace('Guard', '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.guard.ts';

  save(vscode, fs, path, filename, body);
};

export { newJwtGuard };
