// The module 'vscode' contains the VSCode extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { VSCodeMarketplaceClient } from 'vscode-marketplace-client';

// Import the Configs, Controllers, and Providers
import {
  Config,
  EXTENSION_DISPLAY_NAME,
  EXTENSION_ID,
  EXTENSION_NAME,
  USER_PUBLISHER,
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
import {
  FeedbackProvider,
  ListDTOsProvider,
  ListEntitiesProvider,
  ListFilesProvider,
  ListMethodsProvider,
  ListModulesProvider,
} from './app/providers';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
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

  // Watch for changes in the configuration
  const disposableConfigChange = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      const workspaceConfig = vscode.workspace.getConfiguration(
        EXTENSION_ID,
        resource?.uri,
      );

      if (event.affectsConfiguration(`${EXTENSION_ID}.enable`, resource?.uri)) {
        const isEnabled = workspaceConfig.get<boolean>('enable');

        config.update(workspaceConfig);

        if (isEnabled) {
          const message = vscode.l10n.t(
            'The {0} extension is now enabled and ready to use',
            [EXTENSION_DISPLAY_NAME],
          );
          vscode.window.showInformationMessage(message);
        } else {
          const message = vscode.l10n.t('The {0} extension is now disabled', [
            EXTENSION_DISPLAY_NAME,
          ]);
          vscode.window.showInformationMessage(message);
        }
      }

      if (event.affectsConfiguration(EXTENSION_ID, resource?.uri)) {
        config.update(workspaceConfig);
      }
    },
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
    const message = vscode.l10n.t(
      'Welcome to {0} version {1}! The extension is now active',
      [EXTENSION_DISPLAY_NAME, currentVersion],
    );
    vscode.window.showInformationMessage(message);

    // Update the version in the global state
    context.globalState.update('version', currentVersion);
  }

  // Check if the extension has been updated
  if (previousVersion && previousVersion !== currentVersion) {
    const actions: vscode.MessageItem[] = [
      {
        title: vscode.l10n.t('Release Notes'),
      },
      {
        title: vscode.l10n.t('Dismiss'),
      },
    ];

    const message = vscode.l10n.t(
      "The {0} extension has been updated. Check out what's new in version {1}",
      [EXTENSION_DISPLAY_NAME, currentVersion],
    );
    vscode.window.showInformationMessage(message, ...actions).then((option) => {
      if (!option) {
        return;
      }

      // Handle the actions
      switch (option?.title) {
        case actions[0].title:
          vscode.env.openExternal(
            vscode.Uri.parse(
              `https://marketplace.visualstudio.com/items/${USER_PUBLISHER}.${EXTENSION_NAME}/changelog`,
            ),
          );
          break;

        default:
          break;
      }
    });

    // Update the version in the global state
    context.globalState.update('version', currentVersion);
  }

  // -----------------------------------------------------------------
  // Check for updates
  // -----------------------------------------------------------------

  // Check for updates to the extension
  try {
    // Retrieve the latest version
    VSCodeMarketplaceClient.getLatestVersion(
      USER_PUBLISHER,
      EXTENSION_NAME,
    ).then((latestVersion) => {
      // Check if the latest version is different from the current version
      if (latestVersion !== currentVersion) {
        const actions: vscode.MessageItem[] = [
          {
            title: vscode.l10n.t('Update Now'),
          },
          {
            title: vscode.l10n.t('Dismiss'),
          },
        ];

        const message = vscode.l10n.t(
          'A new version of {0} is available. Update to version {1} now',
          [EXTENSION_DISPLAY_NAME, latestVersion],
        );
        vscode.window
          .showInformationMessage(message, ...actions)
          .then(async (option) => {
            if (!option) {
              return;
            }

            // Handle the actions
            switch (option?.title) {
              case actions[0].title:
                await vscode.commands.executeCommand(
                  'workbench.extensions.action.install.anotherVersion',
                  `${USER_PUBLISHER}.${EXTENSION_NAME}`,
                );
                break;

              default:
                break;
            }
          });
      }
    });
  } catch (error) {
    console.error('Error retrieving extension version:', error);
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
    `${EXTENSION_ID}.activateItem.file.template`,
    config.activateItem.file.template,
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
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateClass(args);
    },
  );
  const disposableGenerateFileController = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.controller`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateController(args);
    },
  );
  const disposableGenerateFileDecorator = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.decorator`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateDecorator(args);
    },
  );
  const disposableGenerateFileDto = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.dto`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateDto(args);
    },
  );
  const disposableGenerateFileException = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.exception`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateException(args);
    },
  );
  const disposableGenerateFileExceptionFilter = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.exceptionFilter`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateExceptionFilter(args);
    },
  );
  const disposableGenerateFileFilter = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.filter`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateFilter(args);
    },
  );
  const disposableGenerateFileGateway = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.gateway`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateGateway(args);
    },
  );
  const disposableGenerateFileGuard = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.guard`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateGuard(args);
    },
  );
  const disposableGenerateFileInterceptor = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.interceptor`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateInterceptor(args);
    },
  );
  const disposableGenerateFileInterface = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.interface`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateInterface(args);
    },
  );
  const disposableGenerateFileJwtGuard = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.jwtGuard`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateJwtGuard(args);
    },
  );
  const disposableGenerateFileJwtStrategy = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.jwtStrategy`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateJwtStrategy(args);
    },
  );
  const disposableGenerateFileMiddleware = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.middleware`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateMiddleware(args);
    },
  );
  const disposableGenerateFileLogger = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.logger`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateLogger(args);
    },
  );
  const disposableGenerateFileModule = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.module`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateModule(args);
    },
  );
  const disposableGenerateFilePipe = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.pipe`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generatePipe(args);
    },
  );
  const disposableGenerateFileProvider = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.provider`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateProvider(args);
    },
  );
  const disposableGenerateFileResolver = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.resolver`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateResolver(args);
    },
  );
  const disposableGenerateFileService = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.service`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateService(args);
    },
  );
  const disposableGenerateFileTest = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.test`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateTest(args);
    },
  );
  const disposableFileCustomElement = vscode.commands.registerCommand(
    `${EXTENSION_ID}.file.template`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      fileController.generateCustomElement(args);
    },
  );

  // -----------------------------------------------------------------
  // Register TerminalController and commands
  // -----------------------------------------------------------------

  // Create a new TerminalController
  const terminalController = new TerminalController(config);

  const disposableTerminalController = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.controller`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateController(args);
    },
  );
  const disposableTerminalGateway = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.gateway`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateGateway(args);
    },
  );
  const disposableTerminalLibrary = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.library`,
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateLibrary();
    },
  );
  const disposableTerminalModule = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.module`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateModule(args);
    },
  );
  const disposableTerminalProvider = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.provider`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateProvider(args);
    },
  );
  const disposableTerminalResolver = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.resolver`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateResolver(args);
    },
  );
  const disposableTerminalResource = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.resource`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateResource(args);
    },
  );
  const disposableTerminalService = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.service`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateService(args);
    },
  );
  const disposableTerminalSubApp = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.subApp`,
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateSubApp();
    },
  );
  const disposableTerminalStart = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.start`,
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.start();
    },
  );
  const disposableTerminalStartDev = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startDev`,
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.startDev();
    },
  );
  const disposableTerminalStartDebug = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startDebug`,
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.startDebug();
    },
  );
  const disposableTerminalStartProd = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.startProd`,
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.startProd();
    },
  );
  const disposableTerminalCustomElement = vscode.commands.registerCommand(
    `${EXTENSION_ID}.terminal.custom`,
    (args) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      terminalController.generateCustomElement(args);
    },
  );

  // -----------------------------------------------------------------
  // Register TransformController and commands
  // -----------------------------------------------------------------

  // Create a new TransformController
  const transformController = new TransformController();

  const disposableTransformJson2Ts = vscode.commands.registerCommand(
    `${EXTENSION_ID}.transform.json.ts`,
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      transformController.json2ts();
    },
  );

  // -----------------------------------------------------------------
  // Register ListFilesController
  // -----------------------------------------------------------------

  // Create a new ListFilesController
  const listFilesController = new ListFilesController(config);

  const disposableListOpenFile = vscode.commands.registerCommand(
    `${EXTENSION_ID}.list.openFile`,
    (uri) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      listFilesController.openFile(uri);
    },
  );

  const disposableListGotoLine = vscode.commands.registerCommand(
    `${EXTENSION_ID}.list.gotoLine`,
    (uri, line) => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      listFilesController.gotoLine(uri, line);
    },
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
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      listFilesProvider.refresh();
    },
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
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      listModulesProvider.refresh();
    },
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
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      listEntitiesProvider.refresh();
    },
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
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      listDTOsProvider.refresh();
    },
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
    () => {
      // Check if the extension is enabled
      if (!config.enable) {
        const message = vscode.l10n.t(
          'The {0} extension is disabled in settings. Enable it to use its features',
          [EXTENSION_DISPLAY_NAME],
        );
        vscode.window.showErrorMessage(message);
        return;
      }

      listMethodsProvider.refresh();
    },
  );

  // -----------------------------------------------------------------
  // Register ListFilesProvider and ListMethodsProvider events
  // -----------------------------------------------------------------

  const disposableFileCreate = vscode.workspace.onDidCreateFiles(() => {
    listFilesProvider.refresh();
    listModulesProvider.refresh();
    listEntitiesProvider.refresh();
    listDTOsProvider.refresh();
    listMethodsProvider.refresh();
  });

  const disposableFileSave = vscode.workspace.onDidSaveTextDocument(() => {
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
    disposableConfigChange,
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
    disposableFileCustomElement,
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
    disposableFileCreate,
    disposableFileSave,
    feedbackProvider,
    disposableFeedbackTreeView,
    disposableFeedbackAboutUs,
    disposableFeedbackReportIssues,
    disposableFeedbackRateUs,
    disposableFeedbackSupportUs,
  );
}

export function deactivate() {}
