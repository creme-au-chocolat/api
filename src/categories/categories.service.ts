import { Injectable } from '@nestjs/common';
import { HtmlParserService } from '../html-parser/html-parser/html-parser.service';

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
}
