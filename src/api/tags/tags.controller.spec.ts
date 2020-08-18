jest.mock('./tags.service');

import { CacheModule, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { random, seed } from 'faker';
import { chunk } from 'lodash';
import { Tag } from 'src/shared/types/tag.entity';
import { CATEGORIES } from '../../shared/enum/tag-categories.enum';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { mockedTags } from './__mocks__/tags.service';

describe('CategoriesController', () => {
  let tagsController: TagsController;

  beforeEach(async () => {
    seed(1);

    const moduleRef = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [TagsService],
      imports: [CacheModule.register({ ttl: 1 })],
    }).compile();

    tagsController = moduleRef.get(TagsController);
  });

  describe('getCategories', () => {
    it('should returns available categories', () => {
      const results = ['tags', 'artists', 'characters', 'parodies', 'groups'];

      expect(tagsController.getCategories()).toStrictEqual(results);
    });
  });

  describe('getTagsByCategory', () => {
    it('get values by name in first page', async () => {
      await expect(
        tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: 1 },
        ),
      ).resolves.toMatchSnapshot();
    });

    it('get value by popularity in first page', async () => {
      await expect(
        tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: 1, popular: true },
        ),
      ).resolves.toMatchSnapshot();
    });

    it.each(chunk(Object.keys(CATEGORIES), 1))(
      `correctly filters values for all categories: %s`,
      async category => {
        const currentCategory = CATEGORIES[category];

        await expect(
          tagsController.getTagsByCategory(
            { category: currentCategory },
            { page: 1 },
          ),
        ).resolves.toMatchSnapshot();
      },
    );

    it('get values by name in any page', async () => {
      await expect(
        tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: 2 },
        ),
      ).resolves.toMatchSnapshot();
    });

    it('throws an error when requested page is above total number of pages', async () => {
      await expect(
        tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: 999999 },
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getTagsByCategoryAndLetter', () => {
    it('returns all values starting with letter', async () => {
      await expect(
        tagsController.getTagsByCategoryAndLetter({
          category: CATEGORIES.artists,
          letter: 'A',
        }),
      ).resolves.toMatchSnapshot();
    });

    it('returns empty array when letter does not exists', async () => {
      await expect(
        tagsController.getTagsByCategoryAndLetter({
          category: CATEGORIES.artists,
          letter: 'not a letter',
        }),
      ).resolves.toEqual([]);
    });
  });

  describe('getTagById', () => {
    let tag: Tag;

    beforeEach(() => {
      tag = random.arrayElement(mockedTags);
    });

    it('returns tag details', async () => {
      await expect(
        tagsController.getTagById({ id: tag.id }),
      ).resolves.toMatchSnapshot();
    });
  });

  describe('searchTag', () => {
    it('returns tags matching query', async () => {
      await expect(
        tagsController.searchTag({
          q: 'i',
          category: CATEGORIES.artists,
          page: 1,
        }),
      ).resolves.toMatchSnapshot();
    });
  });
});
