import {
  getClass,
  getFolder,
  getType,
  save,
  toKebabCase,
} from '../../utils/functions';

const content = `export class {className} {}
`;

const newClass = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  const className = await getClass(
    vscode,
    'Class name',
    'E.g. User, Role, Auth...',
  );

  const type = await getType(
    vscode,
    'Type class name',
    'E.g. class, dto, entity, model...',
  );

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + type + '.ts';

  save(vscode, fs, path, filename, body);
};

export { newClass };
