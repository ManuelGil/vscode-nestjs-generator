/**
 * @file Central orchestrator for the NestJS File Generator extension.
 *
 * Handles workspace selection, configuration loading, version notifications,
 * and registration of all commands, tree-view providers, and file watchers.
 * Instantiated by the {@link activate} function in `extension.ts`.
 */
import {
  commands,
  ExtensionContext,
  env,
  l10n,
  MessageItem,
  Uri,
  WorkspaceFolder,
  window,
  workspace,
} from 'vscode';
import { VSCodeMarketplaceClient } from 'vscode-marketplace-client';

import {
  CommandIds,
  Config,
  ContextKeys,
  EXTENSION_DISPLAY_NAME,
  EXTENSION_ID,
  EXTENSION_NAME,
  GlobalStateKeys,
  USER_PUBLISHER,
  ViewIds,
} from './app/configs';
import {
  DTOController,
  FeedbackController,
  FileController,
  ListFilesController,
  ORMController,
  TerminalController,
  TransformController,
} from './app/controllers';
import { clearCache } from './app/helpers';
import {
  FeedbackProvider,
  ListDTOsProvider,
  ListEntitiesProvider,
  ListFilesProvider,
  ListMethodsProvider,
  ListModulesProvider,
} from './app/providers';

/**
 * Orchestrates the full lifecycle of the extension: workspace selection,
 * configuration, version checks, command registration, tree-view providers,
 * and file watchers.
 *
 * Usage follows a two-phase pattern: {@link initialize} resolves the workspace
 * and configuration, then {@link start} registers all VSCode contributions.
 */
export class ExtensionRuntime {
  private warningShown = false;
  private config!: Config;
  private readonly providers: Array<{ refresh: () => void }> = [];

  constructor(private readonly context: ExtensionContext) {}

  /**
   * Initializes the extension runtime.
   * Selects workspace, loads configuration, and handles version notifications.
   * Must complete successfully before start() is called.
   */
  async initialize(): Promise<boolean> {
    const workspace = await this.selectWorkspaceFolder();

    if (!workspace) {
      return false;
    }

    this.initializeConfiguration(workspace);

    if (!this.isExtensionEnabled()) {
      return false;
    }

    this.startVersionChecks();

    return true;
  }

  /**
   * Starts the extension by registering all commands and providers.
   * Only called after successful initialization.
   */
  start(): void {
    this.setContextKeys();
    this.registerWorkspaceCommands();
    this.registerFileCommands();
    this.registerTerminalCommands();
    this.registerTransformCommands();
    this.registerListCommands();
    this.registerTreeViews();
    this.registerFileWatchers();
    this.registerFeedbackCommands();
  }

  /**
   * Starts version related checks without blocking extension activation.
   * Local notifications are fast and run immediately, while the marketplace
   * check runs in the background because it requires a network request.
   */
  private startVersionChecks(): void {
    void this.handleLocalVersionNotifications();
    void this.checkMarketplaceVersion();
  }

  /**
   * Returns the version declared in the extension package.json.
   * If the version cannot be resolved, a fallback value is returned.
   */
  private getCurrentVersion(): string {
    return this.context.extension.packageJSON?.version ?? '0.0.0';
  }

  /**
   * Handles version notifications that depend only on local information.
   * This includes first activation messages and update notifications.
   */
  private async handleLocalVersionNotifications(): Promise<void> {
    const previousVersion = this.context.globalState.get<string>(
      GlobalStateKeys.Version,
    );

    const currentVersion = this.getCurrentVersion();

    // First activation of the extension
    if (!previousVersion) {
      const message = l10n.t(
        'Welcome to {0} version {1}! The extension is now active',
        EXTENSION_DISPLAY_NAME,
        currentVersion,
      );

      window.showInformationMessage(message);

      await this.context.globalState.update(
        GlobalStateKeys.Version,
        currentVersion,
      );

      return;
    }

    // Extension has been updated
    if (previousVersion !== currentVersion) {
      const actions: MessageItem[] = [
        { title: l10n.t('Release Notes') },
        { title: l10n.t('Dismiss') },
      ];

      const message = l10n.t(
        "The {0} extension has been updated. Check out what's new in version {1}",
        EXTENSION_DISPLAY_NAME,
        currentVersion,
      );

      const option = await window.showInformationMessage(message, ...actions);

      // Open the changelog in the marketplace if requested
      if (option?.title === actions[0].title) {
        env.openExternal(
          Uri.parse(
            `https://marketplace.visualstudio.com/items/${USER_PUBLISHER}.${EXTENSION_NAME}/changelog`,
          ),
        );
      }

      // Persist the new version locally
      await this.context.globalState.update(
        GlobalStateKeys.Version,
        currentVersion,
      );
    }
  }

  /**
   * Checks the VS Code Marketplace for a newer extension version.
   * This operation requires a network request and therefore runs in the background.
   */
  private async checkMarketplaceVersion(): Promise<void> {
    const currentVersion = this.getCurrentVersion();

    try {
      const latestVersion = await VSCodeMarketplaceClient.getLatestVersion(
        USER_PUBLISHER,
        EXTENSION_NAME,
      );

      // No action required if the extension is already up to date
      if (latestVersion === currentVersion) {
        return;
      }

      const actions: MessageItem[] = [
        { title: l10n.t('Update Now') },
        { title: l10n.t('Dismiss') },
      ];

      const message = l10n.t(
        'A new version of {0} is available. Update to version {1} now',
        EXTENSION_DISPLAY_NAME,
        latestVersion,
      );

      const option = await window.showInformationMessage(message, ...actions);

      // Trigger the VSCode command to install the new version
      if (option?.title === actions[0].title) {
        await commands.executeCommand(
          'workbench.extensions.action.install.anotherVersion',
          `${USER_PUBLISHER}.${EXTENSION_NAME}`,
        );
      }
    } catch (error) {
      // Marketplace queries may fail due to network issues
      console.error('Error retrieving extension version:', error);
    }
  }

  /**
   * Selects the workspace folder to use for the extension.
   * VSCode does not guarantee a workspace folder exists during activation,
   * so this method explicitly handles missing workspace scenarios.
   */
  private async selectWorkspaceFolder(): Promise<WorkspaceFolder | undefined> {
    const workspaceFolders = workspace.workspaceFolders;

    // Check if there are workspace folders
    if (!workspaceFolders || workspaceFolders.length === 0) {
      const message = l10n.t(
        '{0}: No workspace folders are open. Please open a workspace folder to use this extension',
        EXTENSION_DISPLAY_NAME,
      );
      window.showErrorMessage(message);

      return undefined;
    }

    // Try to load previously selected workspace folder from global state
    const previousFolderUri = this.context.globalState.get<string>(
      GlobalStateKeys.WorkspaceFolder,
    );
    let previousFolder: WorkspaceFolder | undefined;

    // Find the workspace folder by URI
    if (previousFolderUri) {
      previousFolder = workspaceFolders.find(
        (folder) => folder.uri.toString() === previousFolderUri,
      );
    }

    // Determine the workspace folder to use
    // Only one workspace folder available
    if (workspaceFolders.length === 1) {
      return workspaceFolders[0];
    }

    // Use previously selected workspace folder if available
    if (previousFolder) {
      // Notify the user which workspace is being used
      window.showInformationMessage(
        l10n.t('Using workspace folder: {0}', previousFolder.name),
      );

      return previousFolder;
    }

    // Multiple workspace folders and no previous selection
    const placeHolder = l10n.t(
      '{0}: Select a workspace folder to use. This folder will be used to load workspace-specific configuration for the extension',
      EXTENSION_DISPLAY_NAME,
    );
    const selectedFolder = await window.showWorkspaceFolderPick({
      placeHolder,
    });

    // Remember the selection for future use
    if (selectedFolder) {
      this.context.globalState.update(
        GlobalStateKeys.WorkspaceFolder,
        selectedFolder.uri.toString(),
      );
    }

    return selectedFolder;
  }

  /**
   * Initializes configuration and sets up a listener for configuration changes.
   * The listener updates context keys and notifies users when enable state changes.
   */
  private initializeConfiguration(workspaceFolder: WorkspaceFolder): void {
    this.config = new Config(
      workspace.getConfiguration(EXTENSION_ID, workspaceFolder.uri),
    );
    this.config.workspaceRoot = workspaceFolder.uri.fsPath;

    const disposableConfigChange = workspace.onDidChangeConfiguration(
      (event) => {
        const workspaceConfig = workspace.getConfiguration(
          EXTENSION_ID,
          workspaceFolder.uri,
        );

        if (
          event.affectsConfiguration(
            `${EXTENSION_ID}.enable`,
            workspaceFolder.uri,
          )
        ) {
          const isEnabled = workspaceConfig.get<boolean>('enable');

          this.config.update(workspaceConfig);

          if (isEnabled) {
            const message = l10n.t(
              'The {0} extension is now enabled and ready to use',
              EXTENSION_DISPLAY_NAME,
            );
            window.showInformationMessage(message);
          } else {
            const message = l10n.t(
              'The {0} extension is now disabled',
              EXTENSION_DISPLAY_NAME,
            );
            window.showInformationMessage(message);
          }
        }

        if (event.affectsConfiguration(EXTENSION_ID, workspaceFolder.uri)) {
          this.config.update(workspaceConfig);
        }
      },
    );

    this.context.subscriptions.push(disposableConfigChange);
  }

  /**
   * Checks if the extension is enabled based on the current configuration.
   * If disabled, shows a warning message to the user (only once).
   *
   * @returns true if the extension is enabled, false otherwise
   */
  private isExtensionEnabled(): boolean {
    const isEnabled = this.config.enable;

    if (isEnabled) {
      this.warningShown = false;
      return true;
    }

    if (!this.warningShown) {
      window.showErrorMessage(
        l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          EXTENSION_DISPLAY_NAME,
        ),
      );
      this.warningShown = true;
    }

    return false;
  }

  /**
   * Sets VSCode context keys based on configuration.
   * These keys control menu item visibility in package.json.
   */
  private setContextKeys(): void {
    const contextMappings: Array<[string, boolean]> = [
      [ContextKeys.ActivateItemFileClass, this.config.activateItem.file.class],
      [
        ContextKeys.ActivateItemFileController,
        this.config.activateItem.file.controller,
      ],
      [
        ContextKeys.ActivateItemFileDecorator,
        this.config.activateItem.file.decorator,
      ],
      [ContextKeys.ActivateItemFileDto, this.config.activateItem.file.dto],
      [
        ContextKeys.ActivateItemFileException,
        this.config.activateItem.file.exception,
      ],
      [
        ContextKeys.ActivateItemFileExceptionFilter,
        this.config.activateItem.file.exceptionFilter,
      ],
      [
        ContextKeys.ActivateItemFileFilter,
        this.config.activateItem.file.filter,
      ],
      [
        ContextKeys.ActivateItemFileGateway,
        this.config.activateItem.file.gateway,
      ],
      [ContextKeys.ActivateItemFileGuard, this.config.activateItem.file.guard],
      [
        ContextKeys.ActivateItemFileInterceptor,
        this.config.activateItem.file.interceptor,
      ],
      [
        ContextKeys.ActivateItemFileInterface,
        this.config.activateItem.file.interface,
      ],
      [
        ContextKeys.ActivateItemFileJwtGuard,
        this.config.activateItem.file.jwtGuard,
      ],
      [
        ContextKeys.ActivateItemFileJwtStrategy,
        this.config.activateItem.file.jwtStrategy,
      ],
      [
        ContextKeys.ActivateItemFileMiddleware,
        this.config.activateItem.file.middleware,
      ],
      [
        ContextKeys.ActivateItemFileLogger,
        this.config.activateItem.file.logger,
      ],
      [
        ContextKeys.ActivateItemFileModule,
        this.config.activateItem.file.module,
      ],
      [ContextKeys.ActivateItemFilePipe, this.config.activateItem.file.pipe],
      [
        ContextKeys.ActivateItemFileProvider,
        this.config.activateItem.file.provider,
      ],
      [
        ContextKeys.ActivateItemFileResolver,
        this.config.activateItem.file.resolver,
      ],
      [
        ContextKeys.ActivateItemFileService,
        this.config.activateItem.file.service,
      ],
      [ContextKeys.ActivateItemFileTest, this.config.activateItem.file.test],
      [
        ContextKeys.ActivateItemFileTemplate,
        this.config.activateItem.file.template,
      ],
      [
        ContextKeys.ActivateItemTerminalController,
        this.config.activateItem.terminal.controller,
      ],
      [
        ContextKeys.ActivateItemTerminalGateway,
        this.config.activateItem.terminal.gateway,
      ],
      [
        ContextKeys.ActivateItemTerminalModule,
        this.config.activateItem.terminal.module,
      ],
      [
        ContextKeys.ActivateItemTerminalProvider,
        this.config.activateItem.terminal.provider,
      ],
      [
        ContextKeys.ActivateItemTerminalResolver,
        this.config.activateItem.terminal.resolver,
      ],
      [
        ContextKeys.ActivateItemTerminalResource,
        this.config.activateItem.terminal.resource,
      ],
      [
        ContextKeys.ActivateItemTerminalService,
        this.config.activateItem.terminal.service,
      ],
      [
        ContextKeys.ActivateItemTerminalCustom,
        this.config.activateItem.terminal.custom,
      ],
      [
        ContextKeys.ActivateItemTerminalStart,
        this.config.activateItem.terminal.start,
      ],
      [
        ContextKeys.ActivateItemTerminalStartDev,
        this.config.activateItem.terminal.startDev,
      ],
      [
        ContextKeys.ActivateItemTerminalStartDebug,
        this.config.activateItem.terminal.startDebug,
      ],
    ];

    contextMappings.forEach(([key, value]) => {
      commands.executeCommand('setContext', `${EXTENSION_ID}.${key}`, value);
    });
  }

  /**
   * Registers a VSCode command that is gated by the extension's enabled state.
   * If the extension is disabled when the command is invoked, the handler is skipped.
   */
  private registerCommand(
    id: string,
    handler: (...args: any[]) => void | Promise<any>,
  ) {
    return commands.registerCommand(id, (...args: any[]) => {
      if (!this.isExtensionEnabled()) {
        return;
      }

      return handler(...args);
    });
  }

  /** Registers the command that lets users switch the active workspace folder. */
  private registerWorkspaceCommands(): void {
    const disposableChangeWorkspace = commands.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ChangeWorkspace}`,
      async () => {
        const placeHolder = l10n.t('Select a workspace folder to use');
        const selectedFolder = await window.showWorkspaceFolderPick({
          placeHolder,
        });

        if (selectedFolder) {
          this.context.globalState.update(
            GlobalStateKeys.WorkspaceFolder,
            selectedFolder.uri.toString(),
          );

          const workspaceConfig = workspace.getConfiguration(
            EXTENSION_ID,
            selectedFolder.uri,
          );
          this.config.update(workspaceConfig);
          this.config.workspaceRoot = selectedFolder.uri.fsPath;

          window.showInformationMessage(
            l10n.t('Switched to workspace folder: {0}', selectedFolder.name),
          );
        }
      },
    );

    this.context.subscriptions.push(disposableChangeWorkspace);
  }

  /** Registers all file-generation commands (class, controller, service, etc.). */
  private registerFileCommands(): void {
    const fileController = new FileController(this.config);

    const fileCommands: Array<{
      id: CommandIds;
      action: (...args: any[]) => void;
    }> = [
      {
        id: CommandIds.FileClass,
        action: (args) => fileController.generateClass(args),
      },
      {
        id: CommandIds.FileController,
        action: (args) => fileController.generateController(args),
      },
      {
        id: CommandIds.FileDecorator,
        action: (args) => fileController.generateDecorator(args),
      },
      {
        id: CommandIds.FileDto,
        action: (args) => fileController.generateDto(args),
      },
      {
        id: CommandIds.FileException,
        action: (args) => fileController.generateException(args),
      },
      {
        id: CommandIds.FileExceptionFilter,
        action: (args) => fileController.generateExceptionFilter(args),
      },
      {
        id: CommandIds.FileFilter,
        action: (args) => fileController.generateFilter(args),
      },
      {
        id: CommandIds.FileGateway,
        action: (args) => fileController.generateGateway(args),
      },
      {
        id: CommandIds.FileGuard,
        action: (args) => fileController.generateGuard(args),
      },
      {
        id: CommandIds.FileInterceptor,
        action: (args) => fileController.generateInterceptor(args),
      },
      {
        id: CommandIds.FileInterface,
        action: (args) => fileController.generateInterface(args),
      },
      {
        id: CommandIds.FileJwtGuard,
        action: (args) => fileController.generateJwtGuard(args),
      },
      {
        id: CommandIds.FileJwtStrategy,
        action: (args) => fileController.generateJwtStrategy(args),
      },
      {
        id: CommandIds.FileMiddleware,
        action: (args) => fileController.generateMiddleware(args),
      },
      {
        id: CommandIds.FileLogger,
        action: (args) => fileController.generateLogger(args),
      },
      {
        id: CommandIds.FileModule,
        action: (args) => fileController.generateModule(args),
      },
      {
        id: CommandIds.FilePipe,
        action: (args) => fileController.generatePipe(args),
      },
      {
        id: CommandIds.FileProvider,
        action: (args) => fileController.generateProvider(args),
      },
      {
        id: CommandIds.FileResolver,
        action: (args) => fileController.generateResolver(args),
      },
      {
        id: CommandIds.FileService,
        action: (args) => fileController.generateService(args),
      },
      {
        id: CommandIds.FileTest,
        action: (args) => fileController.generateTest(args),
      },
      {
        id: CommandIds.FileCustomElement,
        action: (args) => fileController.generateCustomElement(args),
      },
    ];

    const fileDisposables = fileCommands.map(({ id, action }) =>
      this.registerCommand(`${EXTENSION_ID}.${id}`, action),
    );

    this.context.subscriptions.push(...fileDisposables);
  }

  /** Registers all NestJS CLI terminal commands (generate, start, etc.). */
  private registerTerminalCommands(): void {
    const terminalController = new TerminalController(this.config);

    const terminalCommands: Array<{
      id: CommandIds;
      action: (...args: any[]) => void;
    }> = [
      {
        id: CommandIds.TerminalController,
        action: (args) => terminalController.generateController(args),
      },
      {
        id: CommandIds.TerminalGateway,
        action: (args) => terminalController.generateGateway(args),
      },
      {
        id: CommandIds.TerminalLibrary,
        action: () => terminalController.generateLibrary(),
      },
      {
        id: CommandIds.TerminalModule,
        action: (args) => terminalController.generateModule(args),
      },
      {
        id: CommandIds.TerminalProvider,
        action: (args) => terminalController.generateProvider(args),
      },
      {
        id: CommandIds.TerminalResolver,
        action: (args) => terminalController.generateResolver(args),
      },
      {
        id: CommandIds.TerminalResource,
        action: (args) => terminalController.generateResource(args),
      },
      {
        id: CommandIds.TerminalService,
        action: (args) => terminalController.generateService(args),
      },
      {
        id: CommandIds.TerminalSubApp,
        action: () => terminalController.generateSubApp(),
      },
      {
        id: CommandIds.TerminalStart,
        action: () => terminalController.start(),
      },
      {
        id: CommandIds.TerminalStartDev,
        action: () => terminalController.startDev(),
      },
      {
        id: CommandIds.TerminalStartDebug,
        action: () => terminalController.startDebug(),
      },
      {
        id: CommandIds.TerminalStartProd,
        action: () => terminalController.startProd(),
      },
      {
        id: CommandIds.TerminalCustom,
        action: (args) => terminalController.generateCustomElement(args),
      },
    ];

    const terminalDisposables = terminalCommands.map(({ id, action }) =>
      this.registerCommand(`${EXTENSION_ID}.${id}`, action),
    );

    this.context.subscriptions.push(...terminalDisposables);
  }

  /** Registers data-transformation commands (e.g. JSON to TypeScript). */
  private registerTransformCommands(): void {
    const transformController = new TransformController();

    const disposableTransformJson2Ts = this.registerCommand(
      `${EXTENSION_ID}.${CommandIds.TransformJson2Ts}`,
      () => transformController.json2ts(),
    );

    this.context.subscriptions.push(disposableTransformJson2Ts);
  }

  /** Registers commands for opening files and navigating to lines from tree views. */
  private registerListCommands(): void {
    const listFilesController = new ListFilesController(this.config);

    const disposableListOpenFile = this.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ListOpenFile}`,
      (uri) => listFilesController.openFile(uri),
    );

    const disposableListGotoLine = this.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ListGotoLine}`,
      (uri, line) => listFilesController.gotoLine(uri, line),
    );

    this.context.subscriptions.push(
      disposableListOpenFile,
      disposableListGotoLine,
    );
  }

  /** Creates sidebar tree views (files, modules, entities, DTOs, methods) and their refresh commands. */
  private registerTreeViews(): void {
    const listFilesProvider = new ListFilesProvider();

    const disposableListFilesTreeView = window.createTreeView(
      `${EXTENSION_ID}.${ViewIds.ListFilesView}`,
      {
        treeDataProvider: listFilesProvider,
        showCollapseAll: true,
      },
    );

    const disposableRefreshListFiles = this.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ListFilesRefresh}`,
      () => listFilesProvider.refresh(),
    );

    const listModulesProvider = new ListModulesProvider();

    const disposableListModulesTreeView = window.createTreeView(
      `${EXTENSION_ID}.${ViewIds.ListModulesView}`,
      {
        treeDataProvider: listModulesProvider,
        showCollapseAll: true,
      },
    );

    const disposableRefreshListModules = this.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ListModulesRefresh}`,
      () => listModulesProvider.refresh(),
    );

    const ormController = new ORMController(this.config);
    const listEntitiesProvider = new ListEntitiesProvider(ormController);

    const disposableListEntitiesTreeView = window.createTreeView(
      `${EXTENSION_ID}.${ViewIds.ListEntitiesView}`,
      {
        treeDataProvider: listEntitiesProvider,
        showCollapseAll: true,
      },
    );

    const disposableRefreshListEntities = this.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ListEntitiesRefresh}`,
      () => listEntitiesProvider.refresh(),
    );

    const dtoController = new DTOController();
    const listDTOsProvider = new ListDTOsProvider(dtoController);

    const disposableListDTOsTreeView = window.createTreeView(
      `${EXTENSION_ID}.${ViewIds.ListDTOsView}`,
      {
        treeDataProvider: listDTOsProvider,
        showCollapseAll: true,
      },
    );

    const disposableRefreshListDTOs = this.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ListDTOsRefresh}`,
      () => listDTOsProvider.refresh(),
    );

    const listMethodsProvider = new ListMethodsProvider();

    const disposableListMethodsTreeView = window.createTreeView(
      `${EXTENSION_ID}.${ViewIds.ListMethodsView}`,
      {
        treeDataProvider: listMethodsProvider,
        showCollapseAll: true,
      },
    );

    const disposableRefreshListMethods = this.registerCommand(
      `${EXTENSION_ID}.${CommandIds.ListMethodsRefresh}`,
      () => listMethodsProvider.refresh(),
    );

    this.providers.push(
      listFilesProvider,
      listModulesProvider,
      listEntitiesProvider,
      listDTOsProvider,
      listMethodsProvider,
    );

    this.context.subscriptions.push(
      listFilesProvider,
      disposableListFilesTreeView,
      disposableRefreshListFiles,
      listModulesProvider,
      disposableListModulesTreeView,
      disposableRefreshListModules,
      listEntitiesProvider,
      disposableListEntitiesTreeView,
      disposableRefreshListEntities,
      listDTOsProvider,
      disposableListDTOsTreeView,
      disposableRefreshListDTOs,
      listMethodsProvider,
      disposableListMethodsTreeView,
      disposableRefreshListMethods,
    );
  }

  /** Watches for file creation and save events to auto-refresh all tree-view providers. */
  private registerFileWatchers(): void {
    /**
     * Debounced refresh to avoid excessive UI updates when multiple events fire.
     */
    let refreshTimeout: NodeJS.Timeout | undefined;

    const scheduleRefresh = () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }

      refreshTimeout = setTimeout(() => {
        this.providers.forEach((provider) => provider.refresh());
      }, 150);
    };

    /**
     * Refresh UI only when relevant files (.ts) are saved
     */
    const disposableSave = workspace.onDidSaveTextDocument((document) => {
      if (document.fileName.endsWith('.ts')) {
        scheduleRefresh();
      }
    });

    /**
     * Optional: refresh on file creation (useful for generators)
     */
    const disposableCreate = workspace.onDidCreateFiles(() => {
      scheduleRefresh();
    });

    /**
     * File system watcher for cache invalidation (precise and immediate)
     */
    const watcher = workspace.createFileSystemWatcher('**/*.ts');

    watcher.onDidCreate(() => {
      clearCache();
    });

    watcher.onDidDelete(() => {
      clearCache();
    });

    watcher.onDidChange(() => {
      clearCache();
    });

    /**
     * Register disposables for cleanup
     */
    this.context.subscriptions.push(watcher, disposableSave, disposableCreate);
  }

  /** Registers the feedback tree view and its action commands (about, report, rate, support). */
  private registerFeedbackCommands(): void {
    const feedbackProvider = new FeedbackProvider(new FeedbackController());

    const disposableFeedbackTreeView = window.createTreeView(
      `${EXTENSION_ID}.${ViewIds.FeedbackView}`,
      {
        treeDataProvider: feedbackProvider,
      },
    );

    const disposableFeedbackAboutUs = commands.registerCommand(
      `${EXTENSION_ID}.${CommandIds.FeedbackAboutUs}`,
      () => feedbackProvider.controller.aboutUs(),
    );
    const disposableFeedbackReportIssues = commands.registerCommand(
      `${EXTENSION_ID}.${CommandIds.FeedbackReportIssues}`,
      () => feedbackProvider.controller.reportIssues(),
    );
    const disposableFeedbackRateUs = commands.registerCommand(
      `${EXTENSION_ID}.${CommandIds.FeedbackRateUs}`,
      () => feedbackProvider.controller.rateUs(),
    );
    const disposableFeedbackSupportUs = commands.registerCommand(
      `${EXTENSION_ID}.${CommandIds.FeedbackSupportUs}`,
      () => feedbackProvider.controller.supportUs(),
    );

    this.context.subscriptions.push(
      feedbackProvider,
      disposableFeedbackTreeView,
      disposableFeedbackAboutUs,
      disposableFeedbackReportIssues,
      disposableFeedbackRateUs,
      disposableFeedbackSupportUs,
    );
  }
}
