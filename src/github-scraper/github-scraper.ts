import filesizeParser from 'filesize-parser';
import $ from 'cheerio';
import _ from 'lodash';

import LimitRequest from './limit-request';
import { FileSummary } from './summary.interface';

interface DirectoryStructure {
  directories: string[];
  files: string[];
}

export class GithubScraper {
  private constructor(
    private user: string,
    private repository: string,
    private branch: string,
  ) {}

  private http = new LimitRequest();

  private async getAllFiles(
    dir = '',
  ): Promise<(FileSummary | FileSummary[])[]> {
    const path = dir === '' ? '' : `tree/${this.branch}/${dir}`;
    const url = `https://github.com/${this.user}/${this.repository}/${path}`;
    const html = await this.http.get(url);

    const directory = this.getDirectoryStructure(html);

    const dirSummaries$ = directory.directories.map(p =>
      this.getAllFiles(`${dir}/${p}`),
    );

    const fileSummaries$ = directory.files.map(p =>
      this.getFileSummary(`${dir}/${p}`.slice(1)),
    );

    return await Promise.all([...dirSummaries$, ...fileSummaries$] as any);
  }

  private getDirectoryStructure(html: string): DirectoryStructure {
    const rows = $(
      'div[role="grid"][aria-labelledby="files"] > div.Box-row',
      html,
    );

    const filterByType = (type: string) => (i: number, elem: cheerio.Element) =>
      $(`svg[aria-label="${type}"]`, elem).length > 0;

    const directories = rows.filter(filterByType('Directory'));
    const files = rows.filter(filterByType('File'));

    const getRowName = (i: number, elem: cheerio.Element) =>
      $('div[role="rowheader"] > span > a', elem).text();

    return {
      directories: directories.map(getRowName).get() as string[],
      files: files.map(getRowName).get() as string[],
    };
  }

  private async getFileSummary(file: string): Promise<FileSummary> {
    const url = `https://github.com/${this.user}/${this.repository}/blob/${this.branch}/${file}`;
    const html = await this.http.get(url);

    const text = $(
      '.repository-content > .Box.mt-3 > .Box-header > .text-mono',
      html,
    ).text();

    const sizeMatch = /[.0-9]+ (KB|MB|GB|TB|Bytes)/.exec(text) || [];
    const linesMatch = /(\d+) line[s]?/.exec(text) || [];

    return {
      file,
      size: filesizeParser(sizeMatch[0]),
      lines: _.isNaN(Number(linesMatch[1])) ? null : Number(linesMatch[1]),
    };
  }

  static async getRepositorySummary(
    user: string,
    repository: string,
    branch: string,
  ): Promise<FileSummary[]> {
    const instance = new GithubScraper(user, repository, branch);
    const files = await instance.getAllFiles();
    return _.flatMapDeep(files);
  }
}
