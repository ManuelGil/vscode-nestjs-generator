/**
 * @file Context keys and global-state keys for the NestJS File Generator extension.
 *
 * {@link ContextKeys} control menu/command visibility via `setContext`.
 * {@link GlobalStateKeys} persist cross-session state in VSCode's global storage.
 */

/**
 * VSCode context keys (without the extension ID prefix) used in
 * `when` clauses to toggle command and menu visibility.
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

/** Keys used with {@link ExtensionContext.globalState} to persist data across sessions. */
export enum GlobalStateKeys {
  Version = 'version',
  WorkspaceFolder = 'selectedWorkspaceFolder',
}
