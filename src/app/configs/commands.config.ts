/**
 * @file Command identifier constants for the NestJS File Generator extension.
 *
 * Each value is the short suffix appended to {@link EXTENSION_ID} when
 * registering commands with the VSCode API (e.g. `nestjs.file.controller`).
 */

/**
 * Short command IDs registered by the extension, grouped by category:
 * file generation, terminal (NestJS CLI), list/tree-view actions,
 * data transforms, and feedback actions.
 */
export enum CommandIds {
  ChangeWorkspace = 'changeWorkspace',

  // List commands
  ListOpenFile = 'list.openFile',
  ListGotoLine = 'list.gotoLine',
  ListFilesRefresh = 'listFiles.refresh',
  ListModulesRefresh = 'listModules.refresh',
  ListEntitiesRefresh = 'listEntities.refresh',
  ListDTOsRefresh = 'listDTOs.refresh',
  ListMethodsRefresh = 'listMethods.refresh',

  // Generate file commands
  FileClass = 'file.class',
  FileController = 'file.controller',
  FileDecorator = 'file.decorator',
  FileDto = 'file.dto',
  FileException = 'file.exception',
  FileExceptionFilter = 'file.exceptionFilter',
  FileFilter = 'file.filter',
  FileGateway = 'file.gateway',
  FileGuard = 'file.guard',
  FileInterceptor = 'file.interceptor',
  FileInterface = 'file.interface',
  FileJwtGuard = 'file.jwtGuard',
  FileJwtStrategy = 'file.jwtStrategy',
  FileMiddleware = 'file.middleware',
  FileLogger = 'file.logger',
  FileModule = 'file.module',
  FilePipe = 'file.pipe',
  FileProvider = 'file.provider',
  FileResolver = 'file.resolver',
  FileService = 'file.service',
  FileTest = 'file.test',
  FileCustomElement = 'file.template',

  // Terminal commands
  TerminalController = 'terminal.controller',
  TerminalGateway = 'terminal.gateway',
  TerminalLibrary = 'terminal.library',
  TerminalModule = 'terminal.module',
  TerminalProvider = 'terminal.provider',
  TerminalResolver = 'terminal.resolver',
  TerminalResource = 'terminal.resource',
  TerminalService = 'terminal.service',
  TerminalSubApp = 'terminal.subApp',
  TerminalStart = 'terminal.start',
  TerminalStartDev = 'terminal.startDev',
  TerminalStartDebug = 'terminal.startDebug',
  TerminalStartProd = 'terminal.startProd',
  TerminalCustom = 'terminal.custom',

  TransformJson2Ts = 'transform.json.ts',

  // Feedback commands
  FeedbackAboutUs = 'feedback.aboutUs',
  FeedbackReportIssues = 'feedback.reportIssues',
  FeedbackRateUs = 'feedback.rateUs',
  FeedbackSupportUs = 'feedback.supportUs',
}
