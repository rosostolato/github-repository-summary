import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import LimitRequestMock from './github-scraper/mocks/limit-request.mock';

jest.mock('./github-scraper/limit-request', () => {
  return jest.fn().mockImplementation(() => LimitRequestMock);
});

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
