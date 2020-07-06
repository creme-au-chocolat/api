import { Injectable } from '@nestjs/common';
import { HtmlParserService } from '../html-parser/html-parser/html-parser.service';
import { TagsResponse, Tag } from './models/tags-response';

@Injectable()
export class CategoriesService {
  constructor(private readonly htmlParser: HtmlParserService) {}

  async fetchNumberOfPages(url: string): Promise<number> {
    const $ = await this.htmlParser.parse(url);
    const lastPageArrow = $('.pagination > .last');
    const href = lastPageArrow.attr('href');
    const numberOfPages = href.split('=')[1];

    return parseInt(numberOfPages);
  }

  async fetchTagsInPage(url: string): Promise<Tag[]> {
    return this.htmlParser.mapParse<Tag>(url, '.tag', element => {
      return {
        name: element.find('.name').text(),
        tagged: parseInt(
          element
            .find('.count')
            .text()
            .replace('K', '000'),
        ),
        uri: element.attr('href'),
      };
    });
  }
}
