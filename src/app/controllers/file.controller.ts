/**
 * @file Generates NestJS boilerplate files by writing content directly to disk.
 *
 * Each `generate*` method follows a consistent interactive workflow:
 * 1. Resolve the target folder path from context or user input
 * 2. Prompt for a class/entity name (PascalCase)
 * 3. Build the boilerplate content string for the NestJS artifact
 * 4. Save the file via the {@link saveFile} helper
 * 5. Optionally auto-import the new symbol into the nearest `*.module.ts`
 *
 * @module controllers/file
 */
import path from 'path';
import {
  commands,
  l10n,
  Position,
  Uri,
  WorkspaceEdit,
  window,
  workspace,
} from 'vscode';
import { Config } from '../configs';
import {
  dasherize,
  findFiles,
  getName,
  getPath,
  getWorkspaceRoot,
  saveFile,
  showError,
  showMessage,
  showWarning,
  titleize,
  validateFolderName,
} from '../helpers';
import { relativePath } from '../helpers/relative-path.helper';

/**
 * Generates NestJS boilerplate files (controllers, services, modules, guards,
 * pipes, etc.) by writing TypeScript source directly to disk.
 *
 * All public `generate*` methods share the same interactive flow:
 * resolve path → prompt for folder → prompt for name → build content → save file.
 * Some artifacts (controllers, services, modules, filters, gateways) also
 * trigger {@link autoImport} to register the new symbol in the nearest module.
 *
 * @class
 * @export
 * @public
 */
export class FileController {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the FileController class.
   *
   * @constructor
   * @public
   * @memberof FileController
   */
  constructor(private readonly config: Config) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Generate a new class file.
   *
   * @function generateClass
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateClass(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateClass(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }


    let type = await getName(
      l10n.t('Enter the type name'),
      l10n.t('E.g. class, dto, entity, model...'),
      (type: string) => {
        if (!/[a-z]+/.test(type)) {
          return l10n.t('Invalid format!');
        }
        return;
      },
    );

    if (!type) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `export class ${className}${titleize(type)} {}
`;

    type = type.length !== 0 ? `.${type}` : '';

    const filename = `${dasherize(className)}${type}.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new controller file.
   *
   * @function generateController
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateController(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateController(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the controller name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Create${className}Dto } from './dto/create-${dasherize(
      className,
    )}.dto';
import { Update${className}Dto } from './dto/update-${dasherize(
      className,
    )}.dto';
import { ${className}Service } from './${dasherize(className)}.service';

@Controller('${dasherize(className)}s')
export class ${className}Controller {
  constructor(private readonly ${dasherize(
    className,
  )}Service: ${className}Service) {}

  @Post()
  create(@Body() create${className}Dto: Create${className}Dto) {
    return this.${dasherize(className)}Service.create(create${className}Dto);
  }

  @Get()
  findAll() {
    return this.${dasherize(className)}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${dasherize(className)}Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update${className}Dto: Update${className}Dto) {
    return this.${dasherize(
      className,
    )}Service.update(+id, update${className}Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${dasherize(className)}Service.remove(+id);
  }
}
`;

    const filename = `${dasherize(className)}.controller.ts`;

    void saveFile(folder, filename, content, this.config);

    void this.autoImport(
      folder,
      'controllers',
      `${className}Controller`,
      `${dasherize(className)}.controller`,
    );
  }

  /**
   * Generate a new decorator file.
   *
   * @function generateDecorator
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateDecorator(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateDecorator(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }

    const entityName = await getName(
      l10n.t('Enter the decorator name'),
      l10n.t('E.g. user, role, auth...'),
      (name: string) => {
        if (!/^[A-Za-z-]{3,}$/.test(name)) {
          return l10n.t('Invalid format!');
        }
        return;
      },
    );

    if (!entityName) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { SetMetadata } from '@nestjs/common';

export const ${entityName} = (...args: string[]) =>
  SetMetadata('${entityName}-decorator', args);
`;

    const filename = `${dasherize(entityName)}.decorator.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new dto file.
   *
   * @function generateDto
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateDto(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateDto(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the Dto class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { PartialType } from '@nestjs/mapped-types';
import { Create${className}Dto } from './create-${dasherize(className)}.dto';

export class Update${className}Dto extends PartialType(Create${className}Dto) {
  name: string;
  age: number;
}
`;

    const filename = `update-${dasherize(className)}.dto.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new exception filter file.
   *
   * @function generateExceptionFilter
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateExceptionFilter(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateExceptionFilter(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the exception filter name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class ${className}ExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json();
  }
}
`;

    const filename = `${dasherize(className)}.filter.ts`;

    void saveFile(folder, filename, content, this.config);

    void this.autoImport(
      folder,
      'providers',
      `${className}ExceptionFilter`,
      `${dasherize(className)}.filter`,
    );
  }

  /**
   * Generate a new exception file.
   *
   * @function generateException
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateException(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateException(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the exception class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { HttpException, HttpStatus } from '@nestjs/common';

export class ${className}Exception extends HttpException {
  constructor() {
    super('${className}Exception', HttpStatus.FORBIDDEN);
  }
}
`;

    const filename = `${dasherize(className)}.exception.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new filter file.
   *
   * @function generateFilter
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateFilter(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateFilter(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the filter class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class ${className}Filter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
`;

    const filename = `${dasherize(className)}.filter.ts`;

    void saveFile(folder, filename, content, this.config);

    void this.autoImport(
      folder,
      'providers',
      `${className}Filter`,
      `${dasherize(className)}.filter`,
    );
  }

  /**
   * Generate a new gateway file.
   *
   * @function generateGateway
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateGateway(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateGateway(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the gateway class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class ${className}Gateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
`;

    const filename = `${dasherize(className)}.gateway.ts`;

    void saveFile(folder, filename, content, this.config);

    void this.autoImport(
      folder,
      'providers',
      `${className}Gateway`,
      `${dasherize(className)}.gateway`,
    );
  }

  /**
   * Generate a new guard file.
   *
   * @function generateGuard
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateGuard(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateGuard(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the guard class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ${className}Guard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
`;

    const filename = `${dasherize(className)}.guard.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new interceptor file.
   *
   * @function generateInterceptor
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateInterceptor(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateInterceptor(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the interceptor class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ${className}Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}
`;

    const filename = `${dasherize(className)}.interceptor.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new interface file.
   *
   * @function generateInterface
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateInterface(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateInterface(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the interface class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }


    let type = await getName(
      l10n.t('Enter the interface type'),
      l10n.t('E.g. interface, dto, entity, model...'),
      (type: string) => {
        if (!/[a-z]+/.test(type)) {
          return l10n.t('Invalid format!');
        }
        return;
      },
    );

    if (!type) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `export interface ${className}${titleize(type)} {}
`;

    type = type.length !== 0 ? `.${type}` : '';

    const filename = `${dasherize(className)}${type}.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new jwt guard file.
   *
   * @function generateJwtGuard
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateJwtGuard(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateJwtGuard(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the jwt guard class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ${className}Guard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
`;

    const filename = `${dasherize(className)}.guard.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new jwt strategy file.
   *
   * @function generateJwtStrategy
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateJwtStrategy(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateJwtStrategy(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }

    const content = `import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('secret'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
`;

    const filename = 'jwt.strategy.ts';

    void saveFile(folder, filename, content, this.config);

    void this.autoImport(folder, 'providers', 'JwtStrategy', 'jwt.strategy');
  }

  /**
   * Generate a new logger file.
   *
   * @function generateLogger
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateLogger(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateLogger(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the logger class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { LoggerService } from '@nestjs/common';

export class ${className}Logger implements LoggerService {
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

    const filename = `${dasherize(className)}.logger.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new middleware file.
   *
   * @function generateMiddleware
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateMiddleware(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateMiddleware(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the middleware class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ${className}Middleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
`;

    const filename = `${dasherize(className)}.middleware.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new module file.
   *
   * @function generateModule
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateModule(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateModule(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the module class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: []
})
export class ${className}Module {}
`;

    const filename = `${dasherize(className)}.module.ts`;

    void saveFile(folder, filename, content, this.config);

    void this.autoImport(
      folder,
      'imports',
      `${className}Module`,
      `${dasherize(className)}.module`,
    );
  }

  /**
   * Generate a new pipe file.
   *
   * @function generatePipe
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generatePipe(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generatePipe(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the pipe class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ${className}Pipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
`;

    const filename = `${dasherize(className)}.pipe.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new provider file.
   *
   * @function generateProvider
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateProvider(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateProvider(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the provider class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className} {}
`;

    const filename = `${dasherize(className)}.provider.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new resolver file.
   *
   * @function generateResolver
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateResolver(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateResolver(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the resolver class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { Resolver } from '@nestjs/graphql';

@Resolver()
export class ${className}Resolver {}
`;

    const filename = `${dasherize(className)}.resolver.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Generate a new service file.
   *
   * @function generateService
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateService(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateService(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the service class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { Injectable } from '@nestjs/common';
import { Create${className}Dto } from './dto/create-${dasherize(
      className,
    )}.dto';
import { Update${className}Dto } from './dto/update-${dasherize(
      className,
    )}.dto';

@Injectable()
export class ${className}Service {
  create(create${className}Dto: Create${className}Dto) {
    return 'This action adds a new ${dasherize(className)}';
  }

  findAll() {
    return \`This action returns all ${dasherize(className)}s\`;
  }

  findOne(id: number) {
    return \`This action returns a #id ${dasherize(className)}\`;
  }

  update(id: number, update${className}Dto: Update${className}Dto) {
    return \`This action updates a #id ${dasherize(className)}\`;
  }

  remove(id: number) {
    return \`This action removes a #id ${dasherize(className)}\`;
  }
}
`;

    const filename = `${dasherize(className)}.service.ts`;

    void saveFile(folder, filename, content, this.config);

    void this.autoImport(
      folder,
      'providers',
      `${className}Service`,
      `${dasherize(className)}.service`,
    );
  }

  /**
   * Generate a new test file.
   *
   * @function generateTest
   * @param {Uri} [path] - The path to the folder.
   * @memberof FileController
   * @public
   * @async
   * @example
   * await generateTest(path);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  async generateTest(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }


    const className = await getName(
      l10n.t('Enter the test class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const content = `import { Test } from '@nestjs/testing';
import { ${className}Controller } from './.controller';
import { ${className}Service } from './.service';

describe('${className}Controller', () => {
  let ${className}Controller: ${className}Controller;
  let ${className}Service: ${className}Service;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [${className}Controller],
        providers: [${className}Service],
      }).compile();

    ${className}Service = moduleRef.get<${className}Service>(${className}Service);
    ${className}Controller = moduleRef.get<${className}Controller>(${className}Controller);
  });

  describe('findAll', () => {
    it('should return an array of ${className}', async () => {
      const result = ['test'];
      jest.spyOn(${className}Service, 'findAll').mockImplementation(() => result);

      expect(await ${className}Controller.findAll()).toBe(result);
    });
  });
});
`;

    const filename = `${dasherize(className)}.spec.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  /**
   * Creates a new custom element.
   *
   * @function generateCustomElement
   * @param {Uri} [path] - The path to the folder
   * @public
   * @async
   * @memberof FileController
   * @example
   * generateCustomElement();
   *
   * @returns {Promise<void>} - The result of the operation
   */
  async generateCustomElement(path?: Uri): Promise<void> {

    const folderPath: string = relativePath(path, this.config.useRootWorkspace, this.config);

    const skipFolderConfirmation = this.config.skipFolderConfirmation;
    let folder: string | undefined;

    if (!folderPath || !skipFolderConfirmation) {

      folder = await getPath(
        l10n.t('Enter the folder name'),
        l10n.t('Folder name. E.g. src, app...'),
        folderPath,
        validateFolderName,
      );

      if (!folder) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }
    } else {
      folder = folderPath;
    }

    if (this.config.templates.length === 0) {
      const message = l10n.t(
        'The custom components list is empty. Please add custom components to the configuration',
      );
      window.showErrorMessage(message);
      return;
    }

    const items = this.config.templates.map((item: any) => {
      return {
        label: item.name,
        description: item.description,
        detail: item.type,
      };
    });

    const option = await window.showQuickPick(items, {
      placeHolder: l10n.t(
        'Select the template for the custom element generation',
      ),
    });

    if (!option) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    const template = this.config.templates.find(
      (item: any) => item.name === option.label,
    );

    if (!template) {
      const message = l10n.t(
        'The template for the custom component does not exist. Please try again',
      );
      window.showErrorMessage(message);
      return;
    }

    let content = Object(template).template.join('\n');


    const className = await getName(
      l10n.t('Enter the class name'),
      l10n.t('E.g. User, Role, Auth...'),
      (name: string) => {
        if (!/^[A-Z][A-Za-z]{2,}$/.test(name)) {
          return l10n.t(
            'Invalid format! Entity names MUST be declared in PascalCase',
          );
        }
        return;
      },
    );

    if (!className) {
      const message = l10n.t('Operation cancelled!');
      showError(message);
      return;
    }

    content = content.replace(/{{ComponentName}}/g, className);

    if (content.includes('{{EntityName}}')) {
  
      const entityName = await getName(
        l10n.t('Enter the entity name'),
        l10n.t('E.g. user, role, auth...'),
        (name: string) => {
          if (!/^[a-z][\w-]+$/.test(name)) {
            return l10n.t(
              'Invalid format! Entity names MUST be declared in camelCase',
            );
          }
          return;
        },
      );

      if (!entityName) {
        const message = l10n.t('Operation cancelled!');
        showError(message);
        return;
      }

      content = content.replace(/{{EntityName}}/g, entityName);
    }

    const type =
      Object(template).type.length !== 0 ? `.${Object(template).type}` : '';

    const filename = `${dasherize(className)}${type}.ts`;

    void saveFile(folder, filename, content, this.config);
  }

  // Private methods
  /**
   * Auto import functionality for files.
   *
   * @function autoImport
   * @param {string} directoryPath - The path to the folder.
   * @param {string} type - The type of the file.
   * @param {string} className - The class name.
   * @param {string} filename - The file name.
   * @memberof FileController
   * @private
   * @async
   * @example
   * await autoImport(directoryPath, type, className, filename);
   *
   * @returns {Promise<void>} The result of the operation.
   */
  private async autoImport(
    directoryPath: string,
    type: string,
    className: string,
    filename: string,
  ): Promise<void> {
    try {
      if (!this.config.autoImport) {
        return;
      }

      const workspaceRoot = getWorkspaceRoot(this.config);

      if (!workspaceRoot) {
        return;
      }

      // Convert the workspace-relative directory into an absolute path.
      // The file search helper relies on FastGlob which expects absolute paths.
      const absoluteDirectoryPath = path.join(
        workspaceRoot,
        directoryPath,
      );

      let files: Uri[] = [];
      let searchDirectory = absoluteDirectoryPath;

      // Walk up the directory tree until the nearest *.module.ts is found.
      // This supports typical NestJS structures where feature files live
      // in subfolders (dto, guards, entities, etc.).
      while (true) {
        files = await findFiles({
          baseDirectoryPath: searchDirectory,
          includeFilePatterns: ['*.module.ts'],
          excludedPatterns: this.config.exclude,
          disableRecursive: true,
        });

        if (files.length > 0) {
          break;
        }

        const parent = path.dirname(searchDirectory);
        if (parent === searchDirectory) {
          break;
        }

        searchDirectory = parent;
      }

      if (files.length === 0) {
        showWarning(l10n.t('No module file found. Skipping auto-import!'));
        return;
      }

      const targetFile = files[0];

      const moduleDirectory = path.dirname(targetFile.fsPath);

      const sourceFilePath = path.join(
        workspaceFolder.uri.fsPath,
        directoryPath,
        filename,
      );

      // Compute the import path relative to the module file.
      // Normalize separators and remove the .ts extension for a valid TS import.
      let relativeImportPath = path.relative(moduleDirectory, sourceFilePath);

      relativeImportPath = relativeImportPath
        .replace(/\.ts$/, '')
        .replace(/\\/g, '/');

      if (!relativeImportPath.startsWith('.')) {
        relativeImportPath = './' + relativeImportPath;
      }

      const document = await workspace.openTextDocument(targetFile);
      const documentText = document.getText();

      const importStatement = `import { ${className} } from '${relativeImportPath}';`;

      // Prevent duplicate imports when the generator triggers multiple times.
      if (documentText.includes(importStatement)) {
        return;
      }

      const edit = new WorkspaceEdit();

      let decoratorInsertPosition: Position | undefined;

      // Locate the decorator array (providers, controllers, imports, etc.).
      // The search supports both single-line and multi-line module metadata.
      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i).text;

        if (line.includes(`${type}:`)) {
          let bracketLine = i;
          let bracketIndex = line.indexOf('[');

          if (bracketIndex === -1) {
            for (let j = i + 1; j < document.lineCount; j++) {
              const nextLine = document.lineAt(j).text;
              bracketIndex = nextLine.indexOf('[');

              if (bracketIndex !== -1) {
                bracketLine = j;
                break;
              }
            }
          }

          if (bracketIndex !== -1) {
            const startOfLine = document.offsetAt(new Position(bracketLine, 0));

            decoratorInsertPosition = document.positionAt(
              startOfLine + bracketIndex + 1,
            );

            break;
          }
        }
      }

      if (!decoratorInsertPosition) {
        showWarning(
          l10n.t(
            "Could not find expected '{0}: [...]' section. Skipping auto-import!",
            type,
          ),
        );
        return;
      }

      // Insert the provider/controller entry first because it is located
      // deeper in the file. This avoids offset issues when applying edits.
      edit.insert(targetFile, decoratorInsertPosition, ` ${className},`);

      // Insert the import at the beginning of the file.
      edit.insert(targetFile, new Position(0, 0), importStatement + '\n');

      await workspace.applyEdit(edit);

      await window.showTextDocument(document);

      await commands.executeCommand('editor.action.formatDocument');
      await commands.executeCommand('editor.action.organizeImports');
      await commands.executeCommand('workbench.action.files.saveAll');

      const folder = relativePath(targetFile, false, this.config);

      showMessage(
        l10n.t(
          "Auto-import of {0} into '{1}' was successful!",
          className,
          folder,
        ),
      );
    } catch (error) {
      const message = l10n.t(
        'An error occurred during auto-import: {0}',
        Object(error).message ?? (error as string),
      );

      showError(message);
    }
  }
}
