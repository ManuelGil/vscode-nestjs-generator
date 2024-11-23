import * as vscode from 'vscode';

import { Config, EXTENSION_ID, EXTENSION_NAME } from './app/configs';
import {
  DTOController,
  FeedbackController,
  FileController,
  ListFilesController,
  ORMController,
  TerminalController,
  TransformController,
} from './app/controllers';
import {
  FeedbackProvider,
  ListDTOsProvider,
  ListEntitiesProvider,
  ListFilesProvider,
  ListMethodsProvider,
  ListModulesProvider,
} from './app/providers';

export async function activate(context: vscode.ExtensionContext) {
  // The code you place here will be executed every time your command is executed
  let resource: vscode.WorkspaceFolder | undefined;

  // Check if there are workspace folders
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    const message = vscode.l10n.t(
      'No workspace folders are open. Please open a workspace folder to use this extension',
    );
    vscode.window.showErrorMessage(message);
    return;
  }

  // Optionally, prompt the user to select a workspace folder if multiple are available
  if (vscode.workspace.workspaceFolders.length === 1) {
    resource = vscode.workspace.workspaceFolders[0];
  } else {
    const placeHolder = vscode.l10n.t(
      'Select a workspace folder to use. This folder will be used to load workspace-specific configuration for the extension',
    );
    const selectedFolder = await vscode.window.showWorkspaceFolderPick({
      placeHolder,
    });

    resource = selectedFolder;
  }

  // -----------------------------------------------------------------
  // Initialize the extension
  // -----------------------------------------------------------------

  // Get the configuration for the extension
  const config = new Config(
    vscode.workspace.getConfiguration(EXTENSION_ID, resource?.uri),
  );

  // -----------------------------------------------------------------
  // Get version of the extension
  // -----------------------------------------------------------------

  // Get the previous version of the extension
  const previousVersion = context.globalState.get('version');
  // Get the current version of the extension
  const currentVersion = context.extension.packageJSON.version;

  // Check if the extension is running for the first time
  if (!previousVersion) {
    const message = vscode.l10n.t('Welcome to {0}!', [EXTENSION_NAME]);
    vscode.window.showInformationMessage(message);

    // Update the version in the global state
    context.globalState.update('version', currentVersion);
  }

  // Check if the extension has been updated
  if (previousVersion && previousVersion !== currentVersion) {
    const message = vscode.l10n.t(
      'Looks like {0} has been updated to version {1}!',
      [EXTENSION_NAME, currentVersion],
    );
    vscode.window.showInformationMessage(message);

    // Update the version in the global state
    context.globalState.update('version', currentVersion);
  }

  // -----------------------------------------------------------------
  // Set the context values
  // -----------------------------------------------------------------

  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.class`,
    config.activateItem.file.class,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.controller`,
    config.activateItem.file.controller,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.decorator`,
    config.activateItem.file.decorator,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.dto`,
    config.activateItem.file.dto,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.exception`,
    config.activateItem.file.exception,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.exceptionFilter`,
    config.activateItem.file.exceptionFilter,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.filter`,
    config.activateItem.file.filter,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.gateway`,
    config.activateItem.file.gateway,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.guard`,
    config.activateItem.file.guard,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.interceptor`,
    config.activateItem.file.interceptor,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.interface`,
    config.activateItem.file.interface,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.jwtGuard`,
    config.activateItem.file.jwtGuard,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.jwtStrategy`,
    config.activateItem.file.jwtStrategy,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.middleware`,
    config.activateItem.file.middleware,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.logger`,
    config.activateItem.file.logger,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.module`,
    config.activateItem.file.module,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.pipe`,
    config.activateItem.file.pipe,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.provider`,
    config.activateItem.file.provider,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.resolver`,
    config.activateItem.file.resolver,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.service`,
    config.activateItem.file.service,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.file.test`,
    config.activateItem.file.test,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.controller`,
    config.activateItem.terminal.controller,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.gateway`,
    config.activateItem.terminal.gateway,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.module`,
    config.activateItem.terminal.module,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.provider`,
    config.activateItem.terminal.provider,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.resolver`,
    config.activateItem.terminal.resolver,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.resource`,
    config.activateItem.terminal.resource,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.service`,
    config.activateItem.terminal.service,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.custom`,
    config.activateItem.terminal.custom,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.start`,
    config.activateItem.terminal.start,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.startDev`,
    config.activateItem.terminal.startDev,
  );
  vscode.commands.executeCommand(
    'setContext',
    `${EXTENSION_ID}.activateItem.terminal.startDebug`,
    config.activateItem.terminal.startDebug,
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
  const terminalController = new TerminalController(config);

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
  const disposableTerminalCustomElement = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.custom`,
    (args) => terminalController.generateCustomElement(args),
  );

  // -----------------------------------------------------------------
  // Register TransformController and commands
  // -----------------------------------------------------------------

  // Create a new TransformController
  const transformController = new TransformController();

  const disposableTransformJson2Ts = vscode.commands.registerCommand(
    `${EXTENSION_ID}.transform.json.ts`,
    () => transformController.json2ts(),
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
    disposableTerminalCustomElement,
    disposableTransformJson2Ts,
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
