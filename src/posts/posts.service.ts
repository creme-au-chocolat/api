import { Injectable } from '@nestjs/common';
import { HtmlParserService } from '../html-parser/html-parser/html-parser.service';
import { DetailsResponse } from './types/details-response.type';
import { parseTags } from '../common/helpers/parse-tags.helper';

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
      parodies: parseTags($('#tags > div:nth-child(1) > span > .tag'), $),
      characters: parseTags($('#tags > div:nth-child(2) > span > .tag'), $),
      tags: parseTags($('#tags > div:nth-child(3) > span > .tag'), $),
      artists: parseTags($('#tags > div:nth-child(4) > span > .tag'), $),
      groups: parseTags($('#tags > div:nth-child(5) > span > .tag'), $),
      languages: parseTags($('#tags > div:nth-child(6) > span > .tag'), $),
      categories: parseTags($('#tags > div:nth-child(7) > span > .tag'), $),
    };

    return details;
  }
}
