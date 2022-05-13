import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HtmlParserService {
  constructor(private httpService: HttpService) {}

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
    const response = await firstValueFrom(this.httpService.get<string>(url));

    return response.data;
  }
}
