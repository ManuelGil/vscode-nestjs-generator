import { execute } from './functions';

const start = async (vscode: any) => {
  execute(vscode, 'start', 'nest start');
};

const dev = async (vscode: any) => {
  execute(vscode, 'dev', 'nest start --watch');
};

const debug = async (vscode: any) => {
  execute(vscode, 'debug', 'nest start --debug --watch');
};

const prod = async (vscode: any) => {
  execute(vscode, 'prod', 'node dist/main');
};

export { start, dev, debug, prod };
