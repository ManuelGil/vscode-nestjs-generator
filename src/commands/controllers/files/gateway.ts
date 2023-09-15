import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

const content = `import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class {className}Gateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
`;

const newGateway = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  let className = await getClass(
    vscode,
    'Gateway class name',
    'E.g. User, Role, Auth...',
  );

  if (className === 'Gateway') {
    vscode.window.showErrorMessage('The file has not been created!');
    return;
  }

  className = className.replace(/gateway/gi, '');

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.gateway.ts';

  save(vscode, fs, path, filename, body);
};

export { newGateway };
