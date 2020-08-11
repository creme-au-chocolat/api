import { CacheModule, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { random } from 'faker';
import { chunk } from 'lodash';
import { Tag } from 'src/shared/types/tag.entity';
import { generateRandomTags } from '../../../test/mocks/tags.mock';
import { CATEGORIES } from '../../shared/enum/tag-categories.enum';
import { TagDocument } from '../../shared/schemas/tag.schema';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagListEntity } from './types/tag-list.entity';

describe('CategoriesController', () => {
  let tagsController: TagsController;
  let tagsService: TagsService;

  let mockTags: Tag[] = [];
  const numberOfPages = async (category: CATEGORIES) => {
    const filteredTags = mockTags.filter(
      tag => tag.category === category.toString(),
    );

    return Math.ceil(filteredTags.length / pageSize);
  };

  const pageSize = 120;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        TagsService,
        {
          provide: getModelToken(TagDocument.name),
          useValue: {},
        },
      ],
      imports: [CacheModule.register({ ttl: 1 })],
    }).compile();

    tagsService = moduleRef.get(TagsService);
    tagsController = moduleRef.get(TagsController);

    mockTags = generateRandomTags(1000);
  });

  describe('getCategories', () => {
    it('should returns available categories', () => {
      const results = ['tags', 'artists', 'characters', 'parodies', 'groups'];

      expect(tagsController.getCategories()).toStrictEqual(results);
    });
  });

  describe('getTagsByCategory', () => {
    const getTags = async (category: CATEGORIES, page: number) => {
      return mockTags
        .filter(data => data.category === category)
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;

          return 0;
        })
        .slice(page, page + pageSize);
    };

    const getTagsByPopularity = async (category: CATEGORIES, page: number) => {
      return mockTags
        .filter(data => data.category === category.toString())
        .sort((a, b) => a.tagged - b.tagged)
        .slice(page, page + pageSize);
    };

    beforeEach(() => {
      jest.spyOn(tagsService, 'getPageCount').mockImplementation(numberOfPages);

      jest.spyOn(tagsService, 'getTags').mockImplementation(getTags);

      jest
        .spyOn(tagsService, 'getTagsByPopularity')
        .mockImplementation(getTagsByPopularity);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('get values by name in first page', async () => {
      const results: TagListEntity = {
        data: await getTags(CATEGORIES.artists, 1),
        pagination: {
          page: 1,
          total: await numberOfPages(CATEGORIES.artists),
        },
      };

      expect(
        await tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: 1 },
        ),
      ).toEqual(results);
    });

    it('get value by popularity in first page', async () => {
      const results: TagListEntity = {
        data: await getTagsByPopularity(CATEGORIES.artists, 1),
        pagination: {
          page: 1,
          total: await numberOfPages(CATEGORIES.artists),
        },
      };

      expect(
        await tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: 1, popular: true },
        ),
      ).toEqual(results);
    });

    it.each(chunk(Object.keys(CATEGORIES), 1))(
      `correctly filters values for all categories: %s`,
      async category => {
        const currentCategory = CATEGORIES[category];

        const tags = await tagsController
          .getTagsByCategory(
            {
              category: currentCategory,
            },
            {
              page: 1,
            },
          )
          .then(categories => categories.data);

        tags.forEach(tag => {
          expect(tag.category).toBe(category);
        });
      },
    );

    it('get values by name in random page', async () => {
      const numberOfArtistPage = await numberOfPages(CATEGORIES.artists);

      const randomPage = random.number(numberOfArtistPage);
      const results: TagListEntity = {
        data: await getTags(CATEGORIES.artists, randomPage),
        pagination: {
          page: randomPage,
          total: numberOfArtistPage,
        },
      };

      expect(
        await tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: randomPage },
        ),
      ).toEqual(results);
    });

    it('throws an error when requested page is above total number of pages', async () => {
      await expect(
        tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: await numberOfPages(CATEGORIES.artists) },
        ),
      ).resolves.toBeDefined();

      await expect(
        tagsController.getTagsByCategory(
          { category: CATEGORIES.artists },
          { page: (await numberOfPages(CATEGORIES.artists)) + 1 },
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getTagsByCategoryAndLetter', () => {
    const getTagsByLetter = async (category: CATEGORIES, letter: string) => {
      return mockTags
        .filter(
          data =>
            data.category === category &&
            data.name.toLowerCase().startsWith(letter.toLowerCase()),
        )
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;

          return 0;
        });
    };

    beforeEach(() => {
      mockTags = generateRandomTags(1000);

      jest
        .spyOn(tagsService, 'getTagsByLetter')
        .mockImplementation(getTagsByLetter);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('returns all values starting with letter', async () => {
      const results = await getTagsByLetter(CATEGORIES.artists, 'A');

      await expect(
        tagsController.getTagsByCategoryAndLetter({
          category: CATEGORIES.artists,
          letter: 'A',
        }),
      ).resolves.toEqual(results);
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
      tag = random.arrayElement(mockTags);

      jest.spyOn(tagsService, 'getTagById').mockImplementation(async () => tag);
    });

    it('returns tag details', async () => {
      await expect(
        tagsController.getTagById({ id: tag.id }),
      ).resolves.toStrictEqual(tag);
    });
  });

  describe('searchTag', () => {
    const filterTags = async (query: string, category: CATEGORIES) => {
      const matchRegexp = new RegExp(query, 'gi');

      return mockTags.filter(
        tag =>
          tag.category === category.toString() && tag.name.match(matchRegexp),
      );
    };

    beforeEach(() => {
      jest.spyOn(tagsService, 'search').mockImplementation(filterTags);
    });

    it('returns tags matching query', async () => {
      await expect(
        tagsController.searchTag({ q: 'ab', category: CATEGORIES.artists }),
      ).resolves.toStrictEqual(await filterTags('ab', CATEGORIES.artists));
    });
  });
});
