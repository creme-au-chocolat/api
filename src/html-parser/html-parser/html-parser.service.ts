import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { load } from 'cheerio';

@Injectable()
export class HtmlParserService {
  async parse(url: string): Promise<CheerioStatic> {
    const html = await this.fetchPage(url);
    const $ = load(html);

    return $;
  }

  async mapParse<T>(
    url: string,
    selector: CheerioSelector | string,
    map: (element: Cheerio) => T,
  ): Promise<T[]> {
    const $ = await this.parse(url);

    return $(selector)
      .toArray()
      .map(element => map($(element)));
  }

  private async fetchPage(url: string): Promise<string> {
    return fetch(url).then(response => response.text());
  }
}
