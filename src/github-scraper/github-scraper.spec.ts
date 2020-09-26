import { Test, TestingModule } from '@nestjs/testing';
import { GithubScraper } from './github-scraper';

describe('GithubScraper', () => {
  let service: GithubScraper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    service = module.get<GithubScraper>(GithubScraper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
