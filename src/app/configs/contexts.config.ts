/**
 * Context identifiers for the extension.
 * These are the short IDs without the extension ID prefix.
 */
export enum ContextKeys {
  ActivateItemFileClass = 'activateItem.file.class',
  ActivateItemFileController = 'activateItem.file.controller',
  ActivateItemFileDecorator = 'activateItem.file.decorator',
  ActivateItemFileDto = 'activateItem.file.dto',
  ActivateItemFileException = 'activateItem.file.exception',
  ActivateItemFileExceptionFilter = 'activateItem.file.exceptionFilter',
  ActivateItemFileFilter = 'activateItem.file.filter',
  ActivateItemFileGateway = 'activateItem.file.gateway',
  ActivateItemFileGuard = 'activateItem.file.guard',
  ActivateItemFileInterceptor = 'activateItem.file.interceptor',
  ActivateItemFileInterface = 'activateItem.file.interface',
  ActivateItemFileJwtGuard = 'activateItem.file.jwtGuard',
  ActivateItemFileJwtStrategy = 'activateItem.file.jwtStrategy',
  ActivateItemFileMiddleware = 'activateItem.file.middleware',
  ActivateItemFileLogger = 'activateItem.file.logger',
  ActivateItemFileModule = 'activateItem.file.module',
  ActivateItemFilePipe = 'activateItem.file.pipe',
  ActivateItemFileProvider = 'activateItem.file.provider',
  ActivateItemFileResolver = 'activateItem.file.resolver',
  ActivateItemFileService = 'activateItem.file.service',
  ActivateItemFileTest = 'activateItem.file.test',
  ActivateItemFileTemplate = 'activateItem.file.template',
  ActivateItemTerminalController = 'activateItem.terminal.controller',
  ActivateItemTerminalGateway = 'activateItem.terminal.gateway',
  ActivateItemTerminalModule = 'activateItem.terminal.module',
  ActivateItemTerminalProvider = 'activateItem.terminal.provider',
  ActivateItemTerminalResolver = 'activateItem.terminal.resolver',
  ActivateItemTerminalResource = 'activateItem.terminal.resource',
  ActivateItemTerminalService = 'activateItem.terminal.service',
  ActivateItemTerminalCustom = 'activateItem.terminal.custom',
  ActivateItemTerminalStart = 'activateItem.terminal.start',
  ActivateItemTerminalStartDev = 'activateItem.terminal.startDev',
  ActivateItemTerminalStartDebug = 'activateItem.terminal.startDebug',
}

export enum GlobalStateKeys {
  Version = 'version',
  WorkspaceFolder = 'selectedWorkspaceFolder',
}
