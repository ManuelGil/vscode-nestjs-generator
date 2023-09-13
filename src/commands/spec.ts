import { save } from './functions';

const content = `import { Test } from '@nestjs/testing';
import { {className}Controller } from './.controller';
import { {className}Service } from './.service';

describe('{className}Controller', () => {
  let {className}Controller: {className}Controller;
  let {className}Service: {className}Service;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [{className}Controller],
        providers: [{className}Service],
      }).compile();

    {className}Service = moduleRef.get<{className}Service>({className}Service);
    {className}Controller = moduleRef.get<{className}Controller>({className}Controller);
  });

  describe('findAll', () => {
    it('should return an array of {className}', async () => {
      const result = ['test'];
      jest.spyOn({className}Service, 'findAll').mockImplementation(() => result);

      expect(await {className}Controller.findAll()).toBe(result);
    });
  });
});
`;

let folder: string = '';
let name: string = '';
let filename: string = '';
let body: string = '';

const spec = async (vscode: any, fs: any, path: any) => {
  folder = await vscode.window.showInputBox({
    prompt: 'Folder name',
    placeHolder: 'Folder name. E.g. src, app...',
    validateInput: (text: string) => {
      if (!/^[A-Za-z][\w\s\/-]+$/.test(text)) {
        return 'Invalid format!';
      }
    },
  });

  name = await vscode.window.showInputBox({
    prompt: 'Test class name',
    placeHolder: 'E.g. User, Role, Auth...',
    validateInput: (text: string) => {
      if (!/^[A-Za-z]{3,}$/.test(text)) {
        return 'Invalid format!';
      }
    },
  });

  if (name.length === 0) {
    return;
  }

  body = content.replace(/\{className\}/g, name);

  name = name.toLowerCase();

  folder = folder.endsWith('/') ? folder : folder + '/';
  filename = '/' + folder + name + '.spec.ts';

  save(vscode, fs, path, filename, body);
};

export default spec;
