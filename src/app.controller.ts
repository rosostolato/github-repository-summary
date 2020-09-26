import { Controller, Get, Param, Query } from '@nestjs/common';
import * as _ from 'lodash';

import { WebScraperService } from './web-scraper/web-scraper.service';
import { ExtensionSummary, FileSummary } from './web-scraper/summary.interface';

@Controller()
export class AppController {
  @Get(':user/:repository')
  async getSummary(
    @Param('user') user: string,
    @Param('repository') repository: string,
    @Query('group') group = true,
    @Query('branch') branch?: string,
  ): Promise<(FileSummary | ExtensionSummary)[]> {
    const webScraper = new WebScraperService(user, repository, branch);
    const files = await webScraper.getRepositorySummary();

    if (group) {
      return _(files)
        .groupBy(x => {
          const match = /.*\.(.*)/.exec(x.file);
          return match[1];
        })
        .map(
          (v, k) =>
            ({
              extension: k,
              lines: _.sumBy(
                v.filter(x => _.isNumber(x)),
                x => Number(x.lines),
              ),
              size: 'test',
            } as ExtensionSummary),
        )
        .value();
    }

    return files;
  }
}
