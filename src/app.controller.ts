import { Controller, Get, Param, Query } from '@nestjs/common';
import _ from 'lodash';

import {
  ExtensionSummary,
  FileSummary,
} from './github-scraper/summary.interface';
import { GithubScraper } from './github-scraper/github-scraper';

@Controller()
export class AppController {
  /**
   * Get github repository summary
   * @param user repository owner
   * @param repository repository name
   * @param groupBy should group by extension @default 'extension'
   * @param branch repository branch @default 'master'
   */
  @Get(':user/:repository')
  async getSummary(
    @Param('user') user: string,
    @Param('repository') repository: string,
    @Query('groupBy') groupBy = 'extension',
    @Query('branch') branch = 'master',
  ): Promise<(FileSummary | ExtensionSummary)[]> {
    const files = await GithubScraper.getRepositorySummary(
      user,
      repository,
      branch,
    );

    // returns grouped by extension by default
    if (groupBy === 'extension') {
      return _(files)
        .groupBy(x => {
          const match = /.*\.(.*)/.exec(x.file);
          return match?.[1] || 'others';
        })
        .map(
          (v, k) =>
            ({
              extension: k,
              lines: _.sumBy(v, 'lines'),
              size: _.sumBy(v, 'size'),
            } as ExtensionSummary),
        )
        .value();
    }

    // else return individual files
    return files;
  }
}
