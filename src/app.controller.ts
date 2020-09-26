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
   *
   * @param user repository owner
   * @param repository repository name
   * @param grouped should group by extension @default true
   * @param branch repository branch @default 'master'
   */
  @Get(':user/:repository')
  async getSummary(
    @Param('user') user: string,
    @Param('repository') repository: string,
    @Query('grouped') grouped = true,
    @Query('branch') branch = 'master',
  ): Promise<(FileSummary | ExtensionSummary)[]> {
    const files = await GithubScraper.getRepositorySummary(
      user,
      repository,
      branch,
    );

    // returns grouped by extension by default
    if (grouped) {
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
