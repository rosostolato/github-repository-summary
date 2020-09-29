import { GithubScraper } from './github-scraper';
import LimitRequestMock from './mocks/limit-request.mock';

jest.mock('./limit-request', () => {
  return jest.fn().mockImplementation(() => LimitRequestMock);
});

describe('GithubScraper', () => {
  it('should get repository summary', async () => {
    const files = await GithubScraper.getRepositorySummary(
      'user',
      'repository',
      'branch',
    );

    expect(files).toEqual([
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
