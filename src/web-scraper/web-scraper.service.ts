import * as $ from 'cheerio';
import * as _ from 'lodash';
import got from 'got';

function getRowName(i: number, elem: cheerio.Element) {
  return $('div[role="rowheader"] > span > a', elem).text();
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

  async summarizeRepository() {
    const allFiles = await this.getAllFiles();
    const promises = allFiles.map(file => this.getFileSummary(file));
    return await Promise.all(promises);
  }

  private async getAllFiles(dir = '') {
    const path = dir === '' ? '' : `tree/${this.branch}/${dir}`;
    const url = `https://github.com/${this.user}/${this.repository}/${path}`;
    const html = await got(url);

    const result = this.getFilesInFolder(html.body);
    result.files = result.files.map(f => `${dir}/${f}`.slice(1));

    if (result.directories.length) {
      const promises = result.directories.map(p =>
        this.getAllFiles(`${dir}/${p}`),
      );

      const subfiles: string[][] = await Promise.all(promises);
      const normalized = _.flatMap(subfiles, _.identity);
      return [...normalized, ...result.files];
    }

    return result.files;
  }

  private getFilesInFolder(html: string) {
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

  private async getFileSummary(file: string) {
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
