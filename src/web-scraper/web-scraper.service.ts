import * as $ from 'cheerio';
import * as _ from 'lodash';
import got from 'got';
import { FileSummary } from './summary.interface';

function getRowName(i: number, elem: cheerio.Element) {
  return $('div[role="rowheader"] > span > a', elem).text();
}

interface DirectoryStructure {
  directories: string[];
  files: string[];
}

export class WebScraperService {
  constructor(
    protected user: string,
    protected repository: string,
    protected branch?: string,
  ) {
    if (!this.branch) {
      this.branch = 'master';
    }
  }

  async getRepositorySummary(): Promise<FileSummary[]> {
    const files = await this.getAllFiles();
    return _.flatMapDeep(files);
  }

  private async getAllFiles(
    dir = '',
  ): Promise<(FileSummary | FileSummary[])[]> {
    const path = dir === '' ? '' : `tree/${this.branch}/${dir}`;
    const url = `https://github.com/${this.user}/${this.repository}/${path}`;
    const html = await got(url);

    const directory = this.getDirectoryStructure(html.body);

    const fileSummaries$ = directory.files.map(f =>
      this.getFileSummary(`${dir}/${f}`.slice(1)),
    );

    if (directory.directories.length) {
      const dirSummaries$ = directory.directories.map(p =>
        this.getAllFiles(`${dir}/${p}`),
      );

      return await Promise.all([...dirSummaries$, ...fileSummaries$] as any);
    }

    return await Promise.all(fileSummaries$);
  }

  private getDirectoryStructure(html: string): DirectoryStructure {
    const rows = $(
      'div[role="grid"][aria-labelledby="files"] > div.Box-row',
      html,
    );

    const directories = rows.filter(
      (i, row) => $('svg[aria-label="Directory"]', row).length > 0,
    );

    const files = rows.filter(
      (i, row) => $('svg[aria-label="File"]', row).length > 0,
    );

    return {
      directories: directories.map(getRowName).get() as string[],
      files: files.map(getRowName).get() as string[],
    };
  }

  private async getFileSummary(file: string): Promise<FileSummary> {
    const url = `https://github.com/${this.user}/${this.repository}/blob/${this.branch}/${file}`;
    const html = await got(url);

    const text = $(
      '.repository-content > .Box.mt-3 > .Box-header > .text-mono',
      html.body,
    ).text();

    const sizeMatch = /[.0-9]+ (KB|MB|GB|TB|Bytes)/.exec(text) || [];
    const linesMatch = /(\d+) line[s]?/.exec(text) || [];

    return {
      file,
      size: sizeMatch[0] || 'not specified',
      lines: Number(linesMatch[1] || 0) || 'not specified',
    };
  }
}
