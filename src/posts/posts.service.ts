import { Injectable } from '@nestjs/common';
import { HtmlParserService } from '../html-parser/html-parser/html-parser.service';
import { DetailsResponse, TagComponent } from './types/details-response.type';

@Injectable()
export class PostsService {
  constructor(private readonly htmlParser: HtmlParserService) {}

  async details(id: number): Promise<Required<DetailsResponse>> {
    const $ = await this.htmlParser.parse(`https://nhentai.net/g/${id}/`);

    const details: Required<DetailsResponse> = {
      id: id,
      name: $('.title').text(),
      thumbnail: $('#cover > a > img').data('src'),
      pages: parseInt($('#tags > div:nth-child(8) > span > a > span').text()),
      uploadDate: $('.tags > time').attr('datetime'),
      parodies: this.tagList($('#tags > div:nth-child(1) > span > .tag'), $),
      characters: this.tagList($('#tags > div:nth-child(2) > span > .tag'), $),
      tags: this.tagList($('#tags > div:nth-child(3) > span > .tag'), $),
      artists: this.tagList($('#tags > div:nth-child(4) > span > .tag'), $),
      groups: this.tagList($('#tags > div:nth-child(5) > span > .tag'), $),
      languages: this.tagList($('#tags > div:nth-child(6) > span > .tag'), $),
      categories: this.tagList($('#tags > div:nth-child(7) > span > .tag'), $),
    };

    return details;
  }

  private tagList(element: Cheerio, $: CheerioStatic): TagComponent[] {
    return element.toArray().map<TagComponent>(rawElement => {
      const el = $(rawElement);

      return {
        name: el.find('.name').text(),
        tagged: parseInt(
          el
            .find('.count')
            .text()
            .replace('K', '000'),
        ),
        uri: el.attr('href'),
      };
    });
  }
}
