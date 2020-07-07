import { Injectable, NotFoundException } from '@nestjs/common';
import { HtmlParserService } from '../html-parser/html-parser/html-parser.service';
import { Tag } from '../common/types/tag.type';
import { parseTag, parseTags } from '../common/helpers/parse-tags.helper';

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
    return this.htmlParser.mapParse<Tag>(url, '.tag', parseTag);
  }

  async fetchTagsByLetter(letter: string, category: string): Promise<Tag[]> {
    const $ = await this.htmlParser.parse(`https://nhentai.net/${category}`);
    const navigationLetters = $('.alphabetical-pagination > li > a');
    const selectedLetterElement = navigationLetters
      .toArray()
      .find(el => el.attribs['href'].split('#')[1] === letter);

    const page = selectedLetterElement?.attribs['href'].split('=')[1];

    if (!page) {
      throw new NotFoundException();
    }

    return this.getTagsByLetterInPage(parseInt(page), letter, category);
  }

  private async getTagsByLetterInPage(
    startingPage: number,
    letter: string,
    category: string,
  ): Promise<Tag[]> {
    const tags: Tag[] = [];

    const $ = await this.htmlParser.parse(
      `https://nhentai.net/${category}/?page=${startingPage}`,
    );
    const letterSection = $(`#${letter}`);

    if (letterSection.toArray().length) {
      const tagsElements = letterSection.find('a');

      tags.push(...parseTags(tagsElements, $));

      tags.push(
        ...(await this.getTagsByLetterInPage(
          startingPage + 1,
          letter,
          category,
        )),
      );
    }

    return tags;
  }
}