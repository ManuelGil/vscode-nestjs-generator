import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import classType from './commands/class';
import controller from './commands/controller';
import decorator from './commands/decorator';
import dto from './commands/dto';
import exception from './commands/exception';
import exceptionFilter from './commands/exception-filter';
import filter from './commands/filter';
import gateway from './commands/gateway';
import guard from './commands/guard';
import interceptor from './commands/interceptor';
import jwtGuard from './commands/jwt-guard';
import jwtStrategy from './commands/jwt-strategy';
import logger from './commands/logger';
import middleware from './commands/middleware';
import moduleType from './commands/module';
import pipe from './commands/pipe';
import provider from './commands/provider';
import resolver from './commands/resolver';
import service from './commands/service';
import spec from './commands/spec';

export function activate(context: vscode.ExtensionContext) {
  const generateFileClass = vscode.commands.registerCommand('nest.file.class', () => {
    classType(vscode, fs, path);
  });
  const generateFileController = vscode.commands.registerCommand('nest.file.controller', () => {
    controller(vscode, fs, path);
  });
  const generateFileDecorator = vscode.commands.registerCommand('nest.file.decorator', () => {
    decorator(vscode, fs, path);
  });
  const generateFileDto = vscode.commands.registerCommand('nest.file.dto', () => {
    dto(vscode, fs, path);
  });
  const generateFileException = vscode.commands.registerCommand('nest.file.exception', () => {
    exception(vscode, fs, path);
  });
  const generateFileExceptionFilter = vscode.commands.registerCommand('nest.file.exception-filter', () => {
    exceptionFilter(vscode, fs, path);
  });
  const generateFileFilter = vscode.commands.registerCommand('nest.file.filter', () => {
    filter(vscode, fs, path);
  });
  const generateFileGateway = vscode.commands.registerCommand('nest.file.gateway', () => {
    gateway(vscode, fs, path);
  });
  const generateFileGuard = vscode.commands.registerCommand('nest.file.guard', () => {
    guard(vscode, fs, path);
  });
  const generateFileInterceptor = vscode.commands.registerCommand('nest.file.interceptor', () => {
    interceptor(vscode, fs, path);
  });
  const generateFileJwtGuard = vscode.commands.registerCommand('nest.file.jwt-guard', () => {
    jwtGuard(vscode, fs, path);
  });
  const generateFileJwtStrategy = vscode.commands.registerCommand('nest.file.jwt-strategy', () => {
    jwtStrategy(vscode, fs, path);
  });
  const generateFileMiddleware = vscode.commands.registerCommand('nest.file.middleware', () => {
    middleware(vscode, fs, path);
  });
  const generateFileLogger = vscode.commands.registerCommand('nest.file.logger', () => {
    logger(vscode, fs, path);
  });
  const generateFileModule = vscode.commands.registerCommand('nest.file.module', () => {
    moduleType(vscode, fs, path);
  });
  const generateFilePipe = vscode.commands.registerCommand('nest.file.pipe', () => {
    pipe(vscode, fs, path);
  });
  const generateFileProvider = vscode.commands.registerCommand('nest.file.provider', () => {
    provider(vscode, fs, path);
  });
  const generateFileResolver = vscode.commands.registerCommand('nest.file.resolver', () => {
    resolver(vscode, fs, path);
  });
  const generateFileService = vscode.commands.registerCommand('nest.file.service', () => {
    service(vscode, fs, path);
  });
  const generateFileTest = vscode.commands.registerCommand('nest.file.spec', () => {
    spec(vscode, fs, path);
  });

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
}

export function deactivate() {}
