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
    () => {
      newClass(vscode, fs, path);
    },
  );
  const generateFileController = vscode.commands.registerCommand(
    'nest.file.controller',
    () => {
      newController(vscode, fs, path);
    },
  );
  const generateFileDecorator = vscode.commands.registerCommand(
    'nest.file.decorator',
    () => {
      newDecorator(vscode, fs, path);
    },
  );
  const generateFileDto = vscode.commands.registerCommand(
    'nest.file.dto',
    () => {
      newDto(vscode, fs, path);
    },
  );
  const generateFileException = vscode.commands.registerCommand(
    'nest.file.exception',
    () => {
      newException(vscode, fs, path);
    },
  );
  const generateFileExceptionFilter = vscode.commands.registerCommand(
    'nest.file.exception-filter',
    () => {
      newExceptionFilter(vscode, fs, path);
    },
  );
  const generateFileFilter = vscode.commands.registerCommand(
    'nest.file.filter',
    () => {
      newFilter(vscode, fs, path);
    },
  );
  const generateFileGateway = vscode.commands.registerCommand(
    'nest.file.gateway',
    () => {
      newGateway(vscode, fs, path);
    },
  );
  const generateFileGuard = vscode.commands.registerCommand(
    'nest.file.guard',
    () => {
      newGuard(vscode, fs, path);
    },
  );
  const generateFileInterceptor = vscode.commands.registerCommand(
    'nest.file.interceptor',
    () => {
      newInterceptor(vscode, fs, path);
    },
  );
  const generateFileJwtGuard = vscode.commands.registerCommand(
    'nest.file.jwt-guard',
    () => {
      newJwtGuard(vscode, fs, path);
    },
  );
  const generateFileJwtStrategy = vscode.commands.registerCommand(
    'nest.file.jwt-strategy',
    () => {
      newJwtStrategy(vscode, fs, path);
    },
  );
  const generateFileMiddleware = vscode.commands.registerCommand(
    'nest.file.middleware',
    () => {
      newMiddleware(vscode, fs, path);
    },
  );
  const generateFileLogger = vscode.commands.registerCommand(
    'nest.file.logger',
    () => {
      newLogger(vscode, fs, path);
    },
  );
  const generateFileModule = vscode.commands.registerCommand(
    'nest.file.module',
    () => {
      newModule(vscode, fs, path);
    },
  );
  const generateFilePipe = vscode.commands.registerCommand(
    'nest.file.pipe',
    () => {
      newPipe(vscode, fs, path);
    },
  );
  const generateFileProvider = vscode.commands.registerCommand(
    'nest.file.provider',
    () => {
      newProvider(vscode, fs, path);
    },
  );
  const generateFileResolver = vscode.commands.registerCommand(
    'nest.file.resolver',
    () => {
      newResolver(vscode, fs, path);
    },
  );
  const generateFileService = vscode.commands.registerCommand(
    'nest.file.service',
    () => {
      newService(vscode, fs, path);
    },
  );
  const generateFileTest = vscode.commands.registerCommand(
    'nest.file.spec',
    () => {
      newTest(vscode, fs, path);
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
