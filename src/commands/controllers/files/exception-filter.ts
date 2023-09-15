import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class {className}ExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json();
  }
}
`;

const newExceptionFilter = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  let className = await getClass(
    vscode,
    'Exception Filter class name',
    'E.g. User, Role, Auth...',
  );

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.filter.ts';

  save(vscode, fs, path, filename, body);
};

export { newExceptionFilter };
