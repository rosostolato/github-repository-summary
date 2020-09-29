import { Response } from 'got';
import { GithubScraper } from './github-scraper';

import repoRoot from './mocks/root.mock';
import repoSrc from './mocks/src.mock';
import repoIndex from './mocks/index.mock';
import repoReadme from './mocks/Readme.mock';
import repoOpml from './mocks/Opml.mock';

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
