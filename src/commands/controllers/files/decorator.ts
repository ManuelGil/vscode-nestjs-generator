import { getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { SetMetadata } from '@nestjs/common';

export const {entityName} = (...args: string[]) =>
  SetMetadata('{entityName}-decorator', args);
`;

const newDecorator = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  const entityName = await vscode.window.showInputBox({
    prompt: 'Decorator name',
    placeHolder: 'E.g. user, role, auth...',
    validateInput: (text: string) => {
      if (!/^[A-Za-z-]{3,}$/.test(text)) {
        return 'Invalid format!';
      }
    },
  });

  const body = content.replace(/\{entityName\}/g, entityName);

  const filename = '/' + folder + toKebabCase(entityName) + '.decorator.ts';

  save(vscode, fs, path, filename, body);
};

export { newDecorator };
