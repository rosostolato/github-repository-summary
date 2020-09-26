import { Controller, Get, Param, Query } from '@nestjs/common';
import { WebScraperService } from './web-scraper/web-scraper.service';

@Controller()
export class AppController {
  @Get(':user/:repository')
  async getSummary(
    @Param('user') user: string,
    @Param('repository') repository: string,
    @Query('branch') branch?: string,
  ) {
    const webScraper = new WebScraperService(user, repository);
    return await webScraper.summarizeRepository();
  }
}
