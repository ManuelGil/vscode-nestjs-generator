import * as vscode from 'vscode';

import { Config, EXTENSION_ID } from './app/configs';
import {
  DTOController,
  FeedbackController,
  FileController,
  ListFilesController,
  ORMController,
  TerminalController,
} from './app/controllers';
import {
  FeedbackProvider,
  ListDTOsProvider,
  ListEntitiesProvider,
  ListFilesProvider,
  ListMethodsProvider,
  ListModulesProvider,
} from './app/providers';

export function activate(context: vscode.ExtensionContext) {
  // The code you place here will be executed every time your command is executed
  let resource:
    | vscode.Uri
    | vscode.TextDocument
    | vscode.WorkspaceFolder
    | undefined;

  // Get the resource for the workspace
  if (vscode.workspace.workspaceFolders) {
    resource = vscode.workspace.workspaceFolders[0];
  }

  // -----------------------------------------------------------------
  // Initialize the extension
  // -----------------------------------------------------------------

  // Get the configuration for the extension
  const config = new Config(
    vscode.workspace.getConfiguration(EXTENSION_ID, resource),
  );

  // -----------------------------------------------------------------
  // Register FileController and commands
  // -----------------------------------------------------------------

  // Create a new FileController
  const fileController = new FileController(config);

  const disposableGenerateFileClass = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.class`,
    (args) => fileController.generateClass(args),
  );
  const disposableGenerateFileController = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.controller`,
    (args) => fileController.generateController(args),
  );
  const disposableGenerateFileDecorator = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.decorator`,
    (args) => fileController.generateDecorator(args),
  );
  const disposableGenerateFileDto = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.dto`,
    (args) => fileController.generateDto(args),
  );
  const disposableGenerateFileException = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.exception`,
    (args) => fileController.generateException(args),
  );
  const disposableGenerateFileExceptionFilter = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.exceptionFilter`,
    (args) => fileController.generateExceptionFilter(args),
  );
  const disposableGenerateFileFilter = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.filter`,
    (args) => fileController.generateFilter(args),
  );
  const disposableGenerateFileGateway = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.gateway`,
    (args) => fileController.generateGateway(args),
  );
  const disposableGenerateFileGuard = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.guard`,
    (args) => fileController.generateGuard(args),
  );
  const disposableGenerateFileInterceptor = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.interceptor`,
    (args) => fileController.generateInterceptor(args),
  );
  const disposableGenerateFileInterface = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.interface`,
    (args) => fileController.generateInterface(args),
  );
  const disposableGenerateFileJwtGuard = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.jwtGuard`,
    (args) => fileController.generateJwtGuard(args),
  );
  const disposableGenerateFileJwtStrategy = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.jwtStrategy`,
    (args) => fileController.generateJwtStrategy(args),
  );
  const disposableGenerateFileMiddleware = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.middleware`,
    (args) => fileController.generateMiddleware(args),
  );
  const disposableGenerateFileLogger = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.logger`,
    (args) => fileController.generateLogger(args),
  );
  const disposableGenerateFileModule = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.module`,
    (args) => fileController.generateModule(args),
  );
  const disposableGenerateFilePipe = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.pipe`,
    (args) => fileController.generatePipe(args),
  );
  const disposableGenerateFileProvider = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.provider`,
    (args) => fileController.generateProvider(args),
  );
  const disposableGenerateFileResolver = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.resolver`,
    (args) => fileController.generateResolver(args),
  );
  const disposableGenerateFileService = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.service`,
    (args) => fileController.generateService(args),
  );
  const disposableGenerateFileTest = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.test`,
    (args) => fileController.generateTest(args),
  );

  // -----------------------------------------------------------------
  // Register TerminalController and commands
  // -----------------------------------------------------------------

  // Create a new TerminalController
  const terminalController = new TerminalController();

  const disposableTerminalController = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.controller`,
    (args) => terminalController.generateController(args),
  );
  const disposableTerminalGateway = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.gateway`,
    (args) => terminalController.generateGateway(args),
  );
  const disposableTerminalLibrary = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.library`,
    () => terminalController.generateLibrary(),
  );
  const disposableTerminalModule = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.module`,
    (args) => terminalController.generateModule(args),
  );
  const disposableTerminalProvider = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.provider`,
    (args) => terminalController.generateProvider(args),
  );
  const disposableTerminalResolver = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.resolver`,
    (args) => terminalController.generateResolver(args),
  );
  const disposableTerminalResource = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.resource`,
    (args) => terminalController.generateResource(args),
  );
  const disposableTerminalService = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.service`,
    (args) => terminalController.generateService(args),
  );
  const disposableTerminalSubApp = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.subApp`,
    () => terminalController.generateSubApp(),
  );
  const disposableTerminalStart = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.start`,
    () => terminalController.start(),
  );
  const disposableTerminalStartDev = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startDev`,
    () => terminalController.startDev(),
  );
  const disposableTerminalStartDebug = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startDebug`,
    () => terminalController.startDebug(),
  );
  const disposableTerminalStartProd = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startProd`,
    () => terminalController.startProd(),
  );

  // -----------------------------------------------------------------
  // Register ListFilesController
  // -----------------------------------------------------------------

  // Create a new ListFilesController
  const listFilesController = new ListFilesController(config);

  const disposableListOpenFile = vscode.commands.registerCommand(
    `${EXTENSION_ID}.list.openFile`,
    (uri) => listFilesController.openFile(uri),
  );

  const disposableListGotoLine = vscode.commands.registerCommand(
    `${EXTENSION_ID}.list.gotoLine`,
    (uri, line) => listFilesController.gotoLine(uri, line),
  );

  // -----------------------------------------------------------------
  // Register ListFilesProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListFilesProvider
  const listFilesProvider = new ListFilesProvider();

  // Register the list provider
  const disposableListFilesTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listFilesView`,
    {
      treeDataProvider: listFilesProvider,
      showCollapseAll: true,
    },
  );

  const disposableRefreshListFiles = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listFiles.refresh`,
    () => listFilesProvider.refresh(),
  );

  // -----------------------------------------------------------------
  // Register ListModulesProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListModulesProvider
  const listModulesProvider = new ListModulesProvider();

  // Register the list provider
  const disposableListModulesTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listModulesView`,
    {
      treeDataProvider: listModulesProvider,
      showCollapseAll: true,
    },
  );

  const disposableRefreshListModules = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listModules.refresh`,
    () => listModulesProvider.refresh(),
  );

  // -----------------------------------------------------------------
  // Register ORMController
  // -----------------------------------------------------------------

  // Create a new ORMController
  const ormController = new ORMController(config);

  // -----------------------------------------------------------------
  // Register ListEntitiesProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListEntitiesProvider
  const listEntitiesProvider = new ListEntitiesProvider(ormController);

  // Register the list provider
  const disposableListEntitiesTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listEntitiesView`,
    {
      treeDataProvider: listEntitiesProvider,
      showCollapseAll: true,
    },
  );

  const disposableRefreshListEntities = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listEntities.refresh`,
    () => listEntitiesProvider.refresh(),
  );

  // -----------------------------------------------------------------
  // Register DTOController
  // -----------------------------------------------------------------

  // Create a new DTOController
  const dtoController = new DTOController();

  // -----------------------------------------------------------------
  // Register ListDTOsProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListDTOsProvider
  const listDTOsProvider = new ListDTOsProvider(dtoController);

  // Register the list provider
  const disposableListDTOsTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listDTOsView`,
    {
      treeDataProvider: listDTOsProvider,
      showCollapseAll: true,
    },
  );

  const disposableRefreshListDTOs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listDTOs.refresh`,
    () => listDTOsProvider.refresh(),
  );

  // -----------------------------------------------------------------
  // Register ListMethodsProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListMethodsProvider
  const listMethodsProvider = new ListMethodsProvider();

  // Register the list provider
  const disposableListMethodsTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listMethodsView`,
    {
      treeDataProvider: listMethodsProvider,
      showCollapseAll: true,
    },
  );

  const disposableRefreshListMethods = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listMethods.refresh`,
    () => listMethodsProvider.refresh(),
  );

  // -----------------------------------------------------------------
  // Register ListFilesProvider and ListMethodsProvider events
  // -----------------------------------------------------------------

  vscode.workspace.onDidCreateFiles(() => {
    listFilesProvider.refresh();
    listModulesProvider.refresh();
    listEntitiesProvider.refresh();
    listDTOsProvider.refresh();
    listMethodsProvider.refresh();
  });
  vscode.workspace.onDidSaveTextDocument(() => {
    listFilesProvider.refresh();
    listModulesProvider.refresh();
    listEntitiesProvider.refresh();
    listDTOsProvider.refresh();
    listMethodsProvider.refresh();
  });

  // -----------------------------------------------------------------
  // Register FeedbackProvider and Feedback commands
  // -----------------------------------------------------------------

  // Create a new FeedbackProvider
  const feedbackProvider = new FeedbackProvider(new FeedbackController());

  // Register the feedback provider
  const disposableFeedbackTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.feedbackView`,
    {
      treeDataProvider: feedbackProvider,
    },
  );

  // Register the commands
  const disposableFeedbackAboutUs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.feedback.aboutUs`,
    () => feedbackProvider.controller.aboutUs(),
  );
  const disposableFeedbackReportIssues = vscode.commands.registerCommand(
    `${EXTENSION_ID}.feedback.reportIssues`,
    () => feedbackProvider.controller.reportIssues(),
  );
  const disposableFeedbackRateUs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.feedback.rateUs`,
    () => feedbackProvider.controller.rateUs(),
  );
  const disposableFeedbackSupportUs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.feedback.supportUs`,
    () => feedbackProvider.controller.supportUs(),
  );

  context.subscriptions.push(
    disposableGenerateFileClass,
    disposableGenerateFileController,
    disposableGenerateFileDecorator,
    disposableGenerateFileDto,
    disposableGenerateFileException,
    disposableGenerateFileExceptionFilter,
    disposableGenerateFileFilter,
    disposableGenerateFileGateway,
    disposableGenerateFileGuard,
    disposableGenerateFileInterceptor,
    disposableGenerateFileInterface,
    disposableGenerateFileJwtGuard,
    disposableGenerateFileJwtStrategy,
    disposableGenerateFileLogger,
    disposableGenerateFileMiddleware,
    disposableGenerateFileModule,
    disposableGenerateFilePipe,
    disposableGenerateFileProvider,
    disposableGenerateFileResolver,
    disposableGenerateFileService,
    disposableGenerateFileTest,
    disposableTerminalController,
    disposableTerminalGateway,
    disposableTerminalLibrary,
    disposableTerminalModule,
    disposableTerminalProvider,
    disposableTerminalResolver,
    disposableTerminalResource,
    disposableTerminalService,
    disposableTerminalSubApp,
    disposableTerminalStart,
    disposableTerminalStartDev,
    disposableTerminalStartDebug,
    disposableTerminalStartProd,
    disposableListOpenFile,
    disposableListGotoLine,
    disposableListFilesTreeView,
    disposableRefreshListFiles,
    disposableListModulesTreeView,
    disposableRefreshListModules,
    disposableListEntitiesTreeView,
    disposableRefreshListEntities,
    disposableListDTOsTreeView,
    disposableRefreshListDTOs,
    disposableListMethodsTreeView,
    disposableRefreshListMethods,
    disposableFeedbackTreeView,
    disposableFeedbackAboutUs,
    disposableFeedbackReportIssues,
    disposableFeedbackRateUs,
    disposableFeedbackSupportUs,
  );
}

export function deactivate() {}
