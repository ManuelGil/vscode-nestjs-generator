import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { LoggerService } from '@nestjs/common';

export class {className}Logger implements LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {}

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {}

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {}
}
`;

const newLogger = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  let className = await getClass(
    vscode,
    'Logger class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Logger') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/logger/gi, '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.logger.ts';

  save(vscode, fs, path, filename, body);
};

export { newLogger };
