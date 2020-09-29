// mock responses
import repoRoot from './root.mock';
import repoSrc from './src.mock';
import repoIndex from './index.mock';
import repoReadme from './readme.mock';
import repoOpml from './opml.mock';

export default {
  async get(url: string) {
    switch (url) {
      case 'https://github.com/user/repository/':
        return repoRoot;

      case 'https://github.com/user/repository/tree/branch//src':
        return repoSrc;

      case 'https://github.com/user/repository/blob/branch/src/index.js':
        return repoIndex;

      case 'https://github.com/user/repository/blob/branch/README':
        return repoReadme;

      case 'https://github.com/user/repository/blob/branch/opml.php':
        return repoOpml;
    }
  },
};
