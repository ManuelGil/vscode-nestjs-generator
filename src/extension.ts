import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import {
  newClass,
  newController,
  newDecorator,
  newDto,
  newException,
  newExceptionFilter,
  newFilter,
  newGateway,
  newGuard,
  newInterceptor,
  newJwtGuard,
  newJwtStrategy,
  newLogger,
  newMiddleware,
  newModule,
  newPipe,
  newProvider,
  newResolver,
  newService,
  newTest,
  start,
  startDebug,
  startDev,
  startProd,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
  const generateFileClass = vscode.commands.registerCommand(
    'nest.file.class',
    (args) => {
      newClass(vscode, fs, path, args);
    },
  );
  const generateFileController = vscode.commands.registerCommand(
    'nest.file.controller',
    (args) => {
      newController(vscode, fs, path, args);
    },
  );
  const generateFileDecorator = vscode.commands.registerCommand(
    'nest.file.decorator',
    (args) => {
      newDecorator(vscode, fs, path, args);
    },
  );
  const generateFileDto = vscode.commands.registerCommand(
    'nest.file.dto',
    (args) => {
      newDto(vscode, fs, path, args);
    },
  );
  const generateFileException = vscode.commands.registerCommand(
    'nest.file.exception',
    (args) => {
      newException(vscode, fs, path, args);
    },
  );
  const generateFileExceptionFilter = vscode.commands.registerCommand(
    'nest.file.exception-filter',
    (args) => {
      newExceptionFilter(vscode, fs, path, args);
    },
  );
  const generateFileFilter = vscode.commands.registerCommand(
    'nest.file.filter',
    (args) => {
      newFilter(vscode, fs, path, args);
    },
  );
  const generateFileGateway = vscode.commands.registerCommand(
    'nest.file.gateway',
    (args) => {
      newGateway(vscode, fs, path, args);
    },
  );
  const generateFileGuard = vscode.commands.registerCommand(
    'nest.file.guard',
    (args) => {
      newGuard(vscode, fs, path, args);
    },
  );
  const generateFileInterceptor = vscode.commands.registerCommand(
    'nest.file.interceptor',
    (args) => {
      newInterceptor(vscode, fs, path, args);
    },
  );
  const generateFileJwtGuard = vscode.commands.registerCommand(
    'nest.file.jwt-guard',
    (args) => {
      newJwtGuard(vscode, fs, path, args);
    },
  );
  const generateFileJwtStrategy = vscode.commands.registerCommand(
    'nest.file.jwt-strategy',
    (args) => {
      newJwtStrategy(vscode, fs, path, args);
    },
  );
  const generateFileMiddleware = vscode.commands.registerCommand(
    'nest.file.middleware',
    (args) => {
      newMiddleware(vscode, fs, path, args);
    },
  );
  const generateFileLogger = vscode.commands.registerCommand(
    'nest.file.logger',
    (args) => {
      newLogger(vscode, fs, path, args);
    },
  );
  const generateFileModule = vscode.commands.registerCommand(
    'nest.file.module',
    (args) => {
      newModule(vscode, fs, path, args);
    },
  );
  const generateFilePipe = vscode.commands.registerCommand(
    'nest.file.pipe',
    (args) => {
      newPipe(vscode, fs, path, args);
    },
  );
  const generateFileProvider = vscode.commands.registerCommand(
    'nest.file.provider',
    (args) => {
      newProvider(vscode, fs, path, args);
    },
  );
  const generateFileResolver = vscode.commands.registerCommand(
    'nest.file.resolver',
    (args) => {
      newResolver(vscode, fs, path, args);
    },
  );
  const generateFileService = vscode.commands.registerCommand(
    'nest.file.service',
    (args) => {
      newService(vscode, fs, path, args);
    },
  );
  const generateFileTest = vscode.commands.registerCommand(
    'nest.file.spec',
    (args) => {
      newTest(vscode, fs, path, args);
    },
  );
  const nestTerminalStart = vscode.commands.registerCommand(
    'nest.terminal.start',
    () => {
      start(vscode);
    },
  );
  const nestTerminalStartDev = vscode.commands.registerCommand(
    'nest.terminal.start.dev',
    () => {
      startDev(vscode);
    },
  );
  const nestTerminalStartDebug = vscode.commands.registerCommand(
    'nest.terminal.start.debug',
    () => {
      startDebug(vscode);
    },
  );
  const nestTerminalStartProd = vscode.commands.registerCommand(
    'nest.terminal.start.prod',
    () => {
      startProd(vscode);
    },
  );

  context.subscriptions.push(generateFileClass);
  context.subscriptions.push(generateFileController);
  context.subscriptions.push(generateFileDecorator);
  context.subscriptions.push(generateFileDto);
  context.subscriptions.push(generateFileException);
  context.subscriptions.push(generateFileExceptionFilter);
  context.subscriptions.push(generateFileFilter);
  context.subscriptions.push(generateFileGateway);
  context.subscriptions.push(generateFileGuard);
  context.subscriptions.push(generateFileInterceptor);
  context.subscriptions.push(generateFileJwtGuard);
  context.subscriptions.push(generateFileJwtStrategy);
  context.subscriptions.push(generateFileLogger);
  context.subscriptions.push(generateFileMiddleware);
  context.subscriptions.push(generateFileModule);
  context.subscriptions.push(generateFilePipe);
  context.subscriptions.push(generateFileProvider);
  context.subscriptions.push(generateFileResolver);
  context.subscriptions.push(generateFileService);
  context.subscriptions.push(generateFileTest);
  context.subscriptions.push(nestTerminalStart);
  context.subscriptions.push(nestTerminalStartDev);
  context.subscriptions.push(nestTerminalStartDebug);
  context.subscriptions.push(nestTerminalStartProd);
}

export function deactivate() {}
