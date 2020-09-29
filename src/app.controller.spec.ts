import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

// mock responses
import { Response } from 'got';
import repoRoot from './github-scraper/mocks/root.mock';
import repoSrc from './github-scraper/mocks/src.mock';
import repoIndex from './github-scraper/mocks/index.mock';
import repoReadme from './github-scraper/mocks/Readme.mock';
import repoOpml from './github-scraper/mocks/Opml.mock';

jest.mock('got', () => ({
  __esModule: true, // this property makes it work
  async default(url: string) {
    switch (url) {
      case 'https://github.com/user/repository/':
        return {
          body: repoRoot,
        } as Response<string>;

      case 'https://github.com/user/repository/tree/branch//src':
        return {
          body: repoSrc,
        } as Response<string>;

      case 'https://github.com/user/repository/blob/branch/src/index.js':
        return {
          body: repoIndex,
        } as Response<string>;

      case 'https://github.com/user/repository/blob/branch/README':
        return {
          body: repoReadme,
        } as Response<string>;

      case 'https://github.com/user/repository/blob/branch/opml.php':
        return {
          body: repoOpml,
        } as Response<string>;
    }
  },
}));

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getSummary', () => {
    it('should get grouped by extension', async () => {
      const response = await appController.getSummary(
        'user',
        'repository',
        'extension',
        'branch',
      );

      expect(response).toEqual([
        {
          extension: 'js',
          lines: 580,
          size: 295936,
        },
        {
          extension: 'others',
          lines: 1,
          size: 57,
        },
        {
          extension: 'php',
          lines: 39,
          size: 747,
        },
      ]);
    });

    it('should get grouped by file', async () => {
      const response = await appController.getSummary(
        'user',
        'repository',
        'file',
        'branch',
      );

      expect(response).toEqual([
        {
          file: 'src/index.js',
          lines: 580,
          size: 295936,
        },
        {
          file: 'README',
          lines: 1,
          size: 57,
        },
        {
          file: 'opml.php',
          lines: 39,
          size: 747,
        },
      ]);
    });
  });
});
