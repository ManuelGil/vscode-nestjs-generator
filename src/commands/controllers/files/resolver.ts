import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { Resolver } from '@nestjs/graphql';

@Resolver()
export class {className}Resolver {}
`;

const newResolver = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  let className = await getClass(
    vscode,
    'Resolver class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Resolver') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/resolver/gi, '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.resolver.ts';

  save(vscode, fs, path, filename, body);
};

export { newResolver };
