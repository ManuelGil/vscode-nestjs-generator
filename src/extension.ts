import * as vscode from 'vscode';

import { EXTENSION_ID } from './app/configs';
import { Config } from './app/configs/config';
import {
  FeedbackController,
  FileController,
  TerminalController,
} from './app/controllers';
import { ListFilesController } from './app/controllers/list-files.controller';
import {
  FeedbackProvider,
  ListFilesProvider,
  ListMethodsProvider,
  ListModulesProvider,
} from './app/providers';

export function activate(context: vscode.ExtensionContext) {
  // The code you place here will be executed every time your command is executed
  let resource: vscode.Uri | null = null;

  // Get the resource for the workspace
  if (vscode.workspace.workspaceFolders) {
    resource = vscode.workspace.workspaceFolders[0].uri;
  }

  // -----------------------------------------------------------------
  // Initialize the extension
  // -----------------------------------------------------------------

  // Get the configuration for the extension
  const config = new Config(
    vscode.workspace.getConfiguration(EXTENSION_ID, resource ?? null),
  );

  // -----------------------------------------------------------------
  // Register FileController and commands
  // -----------------------------------------------------------------

  // Create a new FileController
  const fileController = new FileController();

  const nestjsGenerateFileClass = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.class`,
    (args) => fileController.generateClass(args),
  );
  const nestjsGenerateFileController = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.controller`,
    (args) => fileController.generateController(args),
  );
  const nestjsGenerateFileDecorator = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.decorator`,
    (args) => fileController.generateDecorator(args),
  );
  const nestjsGenerateFileDto = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.dto`,
    (args) => fileController.generateDto(args),
  );
  const nestjsGenerateFileException = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.exception`,
    (args) => fileController.generateException(args),
  );
  const nestjsGenerateFileExceptionFilter = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.exceptionFilter`,
    (args) => fileController.generateExceptionFilter(args),
  );
  const nestjsGenerateFileFilter = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.filter`,
    (args) => fileController.generateFilter(args),
  );
  const nestjsGenerateFileGateway = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.gateway`,
    (args) => fileController.generateGateway(args),
  );
  const nestjsGenerateFileGuard = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.guard`,
    (args) => fileController.generateGuard(args),
  );
  const nestjsGenerateFileInterceptor = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.interceptor`,
    (args) => fileController.generateInterceptor(args),
  );
  const nestjsGenerateFileInterface = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.interface`,
    (args) => fileController.generateInterface(args),
  );
  const nestjsGenerateFileJwtGuard = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.jwtGuard`,
    (args) => fileController.generateJwtGuard(args),
  );
  const nestjsGenerateFileJwtStrategy = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.jwtStrategy`,
    (args) => fileController.generateJwtStrategy(args),
  );
  const nestjsGenerateFileMiddleware = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.middleware`,
    (args) => fileController.generateMiddleware(args),
  );
  const nestjsGenerateFileLogger = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.logger`,
    (args) => fileController.generateLogger(args),
  );
  const nestjsGenerateFileModule = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.module`,
    (args) => fileController.generateModule(args),
  );
  const nestjsGenerateFilePipe = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.pipe`,
    (args) => fileController.generatePipe(args),
  );
  const nestjsGenerateFileProvider = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.provider`,
    (args) => fileController.generateProvider(args),
  );
  const nestjsGenerateFileResolver = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.resolver`,
    (args) => fileController.generateResolver(args),
  );
  const nestjsGenerateFileService = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.service`,
    (args) => fileController.generateService(args),
  );
  const nestjsGenerateFileTest = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.test`,
    (args) => fileController.generateTest(args),
  );

  // -----------------------------------------------------------------
  // Register TerminalController and commands
  // -----------------------------------------------------------------

  // Create a new TerminalController
  const terminalController = new TerminalController();

  const nestjsTerminalController = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.controller`,
    (args) => terminalController.generateController(args),
  );
  const nestjsTerminalGateway = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.gateway`,
    (args) => terminalController.generateGateway(args),
  );
  const nestjsTerminalLibrary = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.library`,
    () => terminalController.generateLibrary(),
  );
  const nestjsTerminalModule = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.module`,
    (args) => terminalController.generateModule(args),
  );
  const nestjsTerminalProvider = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.provider`,
    (args) => terminalController.generateProvider(args),
  );
  const nestjsTerminalResolver = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.resolver`,
    (args) => terminalController.generateResolver(args),
  );
  const nestjsTerminalResource = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.resource`,
    (args) => terminalController.generateResource(args),
  );
  const nestjsTerminalService = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.service`,
    (args) => terminalController.generateService(args),
  );
  const nestjsTerminalSubApp = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.subApp`,
    () => terminalController.generateSubApp(),
  );
  const nestjsTerminalStart = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.start`,
    () => terminalController.start(),
  );
  const nestjsTerminalStartDev = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startDev`,
    () => terminalController.startDev(),
  );
  const nestjsTerminalStartDebug = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startDebug`,
    () => terminalController.startDebug(),
  );
  const nestjsTerminalStartProd = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startProd`,
    () => terminalController.startProd(),
  );

  // -----------------------------------------------------------------
  // Register ListFilesController
  // -----------------------------------------------------------------

  // Create a new ListFilesController
  const listFilesController = new ListFilesController(config);

  // -----------------------------------------------------------------
  // Register ListFilesProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListFilesProvider
  const listFilesProvider = new ListFilesProvider(listFilesController);

  // Register the list provider
  const nestjsListFilesTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listFilesView`,
    {
      treeDataProvider: listFilesProvider,
    },
  );

  const nestjsListOpenFile = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listFiles.openFile`,
    (uri) => listFilesProvider.controller.openFile(uri),
  );

  // -----------------------------------------------------------------
  // Register ListModulesProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListModulesProvider
  const listModulesProvider = new ListModulesProvider(listFilesController);

  // Register the list provider
  const nestjsListModulesTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listModulesView`,
    {
      treeDataProvider: listModulesProvider,
    },
  );

  const nestjsListModulesGotoLine = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listModules.gotoLine`,
    (uri, line) => listModulesProvider.controller.gotoLine(uri, line),
  );

  // -----------------------------------------------------------------
  // Register ListMethodsProvider and list commands
  // -----------------------------------------------------------------

  // Create a new ListMethodsProvider
  const listMethodsProvider = new ListMethodsProvider(listFilesController);

  // Register the list provider
  const nestjsListMethodsTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.listMethodsView`,
    {
      treeDataProvider: listMethodsProvider,
    },
  );

  const nestjsListMethodsGotoLine = vscode.commands.registerCommand(
    `${EXTENSION_ID}.listMethods.gotoLine`,
    (uri, line) => listMethodsProvider.controller.gotoLine(uri, line),
  );

  // -----------------------------------------------------------------
  // Register ListFilesProvider and ListMethodsProvider events
  // -----------------------------------------------------------------

  vscode.workspace.onDidChangeTextDocument(() => {
    listFilesProvider.refresh();
    listMethodsProvider.refresh();
  });
  vscode.workspace.onDidCreateFiles(() => {
    listFilesProvider.refresh();
    listMethodsProvider.refresh();
  });
  vscode.workspace.onDidDeleteFiles(() => {
    listFilesProvider.refresh();
    listMethodsProvider.refresh();
  });
  vscode.workspace.onDidRenameFiles(() => {
    listFilesProvider.refresh();
    listMethodsProvider.refresh();
  });
  vscode.workspace.onDidSaveTextDocument(() => {
    listFilesProvider.refresh();
    listMethodsProvider.refresh();
  });

  // -----------------------------------------------------------------
  // Register FeedbackProvider and Feedback commands
  // -----------------------------------------------------------------

  // Create a new FeedbackProvider
  const feedbackProvider = new FeedbackProvider(new FeedbackController());

  // Register the feedback provider
  const nestjsFeedbackTreeView = vscode.window.createTreeView(
    `${EXTENSION_ID}.feedbackView`,
    {
      treeDataProvider: feedbackProvider,
    },
  );

  // Register the commands
  const nestjsFeedbackAboutUs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.feedback.aboutUs`,
    () => feedbackProvider.controller.aboutUs(),
  );
  const nestjsFeedbackReportIssues = vscode.commands.registerCommand(
    `${EXTENSION_ID}.feedback.reportIssues`,
    () => feedbackProvider.controller.reportIssues(),
  );
  const nestjsFeedbackRateUs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.feedback.rateUs`,
    () => feedbackProvider.controller.rateUs(),
  );
  const nestjsFeedbackSupportUs = vscode.commands.registerCommand(
    `${EXTENSION_ID}.feedback.supportUs`,
    () => feedbackProvider.controller.supportUs(),
  );

  context.subscriptions.push(nestjsGenerateFileClass);
  context.subscriptions.push(nestjsGenerateFileController);
  context.subscriptions.push(nestjsGenerateFileDecorator);
  context.subscriptions.push(nestjsGenerateFileDto);
  context.subscriptions.push(nestjsGenerateFileException);
  context.subscriptions.push(nestjsGenerateFileExceptionFilter);
  context.subscriptions.push(nestjsGenerateFileFilter);
  context.subscriptions.push(nestjsGenerateFileGateway);
  context.subscriptions.push(nestjsGenerateFileGuard);
  context.subscriptions.push(nestjsGenerateFileInterceptor);
  context.subscriptions.push(nestjsGenerateFileInterface);
  context.subscriptions.push(nestjsGenerateFileJwtGuard);
  context.subscriptions.push(nestjsGenerateFileJwtStrategy);
  context.subscriptions.push(nestjsGenerateFileLogger);
  context.subscriptions.push(nestjsGenerateFileMiddleware);
  context.subscriptions.push(nestjsGenerateFileModule);
  context.subscriptions.push(nestjsGenerateFilePipe);
  context.subscriptions.push(nestjsGenerateFileProvider);
  context.subscriptions.push(nestjsGenerateFileResolver);
  context.subscriptions.push(nestjsGenerateFileService);
  context.subscriptions.push(nestjsGenerateFileTest);
  context.subscriptions.push(nestjsTerminalController);
  context.subscriptions.push(nestjsTerminalGateway);
  context.subscriptions.push(nestjsTerminalLibrary);
  context.subscriptions.push(nestjsTerminalModule);
  context.subscriptions.push(nestjsTerminalProvider);
  context.subscriptions.push(nestjsTerminalResolver);
  context.subscriptions.push(nestjsTerminalResource);
  context.subscriptions.push(nestjsTerminalService);
  context.subscriptions.push(nestjsTerminalSubApp);
  context.subscriptions.push(nestjsTerminalStart);
  context.subscriptions.push(nestjsTerminalStartDev);
  context.subscriptions.push(nestjsTerminalStartDebug);
  context.subscriptions.push(nestjsTerminalStartProd);
  context.subscriptions.push(nestjsListFilesTreeView);
  context.subscriptions.push(nestjsListOpenFile);
  context.subscriptions.push(nestjsListModulesTreeView);
  context.subscriptions.push(nestjsListModulesGotoLine);
  context.subscriptions.push(nestjsListMethodsTreeView);
  context.subscriptions.push(nestjsListMethodsGotoLine);
  context.subscriptions.push(nestjsFeedbackTreeView);
  context.subscriptions.push(nestjsFeedbackAboutUs);
  context.subscriptions.push(nestjsFeedbackReportIssues);
  context.subscriptions.push(nestjsFeedbackRateUs);
  context.subscriptions.push(nestjsFeedbackSupportUs);
}

export function deactivate() {}
