import { Injectable, NotFoundException } from '@nestjs/common';
import { compose, filter, orderBy, slice } from 'lodash/fp';
import { CATEGORIES } from 'src/shared/enum/tag-categories.enum';
import { Tag } from 'src/shared/types/tag.entity';
import { generateRandomTags } from 'test/mocks/tags.mock';

export const mockedTags = generateRandomTags(100);

@Injectable()
export class TagsService {
  static PAGE_SIZE = 10;

  async getTagById(id: number): Promise<Tag> {
    const tag = mockedTags.find(tag => tag.id === id);

    if (!tag) throw new NotFoundException();

    return tag;
  }

  async search(searchQuery: string, category?: string): Promise<Tag[]> {
    const nameRegexp = new RegExp(`^.*${searchQuery}.*$`);

    let tags: Tag[];

    if (category) {
      tags = mockedTags
        .filter(tag => nameRegexp.test(tag.name) && tag.category === category)
        .slice(0, 10);
    } else {
      tags = mockedTags.filter(tag => nameRegexp.test(tag.name)).slice(0, 10);
    }

    return tags.sort((a, b) => {
      const aName = a.name;
      const bName = b.name;

      return aName.indexOf(searchQuery) - bName.indexOf(searchQuery);
    });
  }

  async getTagsByPopularity(
    category: CATEGORIES,
    page: number,
  ): Promise<Tag[]> {
    const startingAt = (page - 1) * TagsService.PAGE_SIZE;

    return compose(
      filter((tag: Tag) => tag.category === category),
      orderBy('tagged', 'desc'),
      slice(startingAt, startingAt + TagsService.PAGE_SIZE),
    )(mockedTags);
  }

  async getTags(category: CATEGORIES, page: number): Promise<Tag[]> {
    const startingAt = (page - 1) * TagsService.PAGE_SIZE;

    return compose(
      filter((tag: Tag) => tag.category === category),
      orderBy('name', 'asc'),
      slice(startingAt, startingAt + TagsService.PAGE_SIZE),
    )(mockedTags);
  }

  async getPageCount(category: CATEGORIES): Promise<number> {
    return mockedTags.filter(tag => tag.category === category).length;
  }

  async getTagsByLetter(category: CATEGORIES, letter: string): Promise<Tag[]> {
    const nameRegexp = new RegExp(`^${letter}`, 'i');

    return mockedTags
      .filter(tag => tag.category === category && nameRegexp.test(tag.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
