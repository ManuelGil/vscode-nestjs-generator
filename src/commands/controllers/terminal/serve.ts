import { execute } from '../../utils/functions';

const start = (vscode: any) => {
  execute(vscode, 'start', 'nest start');
};

const startDev = (vscode: any) => {
  execute(vscode, 'dev', 'nest start --watch');
};

const startDebug = (vscode: any) => {
  execute(vscode, 'debug', 'nest start --debug --watch');
};

const startProd = (vscode: any) => {
  execute(vscode, 'prod', 'node dist/main');
};

export { start, startDev, startDebug, startProd };
