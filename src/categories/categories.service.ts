import { Injectable, NotFoundException } from '@nestjs/common';
import { HtmlParserService } from '../html-parser/html-parser/html-parser.service';
import { Tag } from '../common/types/tag.type';
import { parseTags } from '../common/helpers/parse-tags.helper';
import { getPages } from '../common/helpers/get-pagination.helper';

@Injectable()
export class CategoriesService {
  constructor(private readonly htmlParser: HtmlParserService) {}

  async fetchTagsInPage(url: string, page: number): Promise<[Tag[], number]> {
    const $ = await this.htmlParser.parse(url);

    const tags = parseTags($('.tag'), $);
    const pages = getPages($, page);

    return [tags, pages];
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
