import { getClass, getFolder, save, toKebabCase } from '../../utils/functions';

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

const newTest = async (vscode: any, fs: any, path: any) => {
  const folder = await getFolder(
    vscode,
    'Folder name',
    'Folder name. E.g. src, app...',
  );

  const className = await getClass(
    vscode,
    'Test class name',
    'E.g. User, Role, Auth...',
  );

  const body = content.replace(/\{className\}/g, className);

  const filename = '/' + folder + toKebabCase(className) + '.spec.ts';

  save(vscode, fs, path, filename, body);
};

export { newTest };
