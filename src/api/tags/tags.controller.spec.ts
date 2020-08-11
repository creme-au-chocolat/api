import { CacheModule, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { random } from 'faker';
import { chunk } from 'lodash';
import { CATEGORIES } from '../../common/enum/tag-categories.enum';
import { Tag } from '../../common/schemas/tag.schema';
import { TagWithCategory } from '../../common/types/tag-with-category.entity';
import { generateRandomTags } from './mocks/tags.mock';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagListEntity } from './types/tag-list.entity';

describe('CategoriesController', () => {
  let tagsController: TagsController;
  let tagsService: TagsService;

  const pageSize = 120;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        TagsService,
        {
          provide: getModelToken(Tag.name),
          useValue: {},
        },
      ],
      imports: [CacheModule.register({ ttl: 1 })],
    }).compile();

    tagsService = moduleRef.get(TagsService);
    tagsController = moduleRef.get(TagsController);
  });

  describe('categories', () => {
    it('should returns available categories', () => {
      const results = ['tags', 'artists', 'characters', 'parodies', 'groups'];

      expect(tagsController.categories()).toStrictEqual(results);
    });
  });

  describe('tags', () => {
    let datas: TagWithCategory[] = [];
    const numberOfPages = () => {
      return Math.ceil(datas.length / pageSize);
    };

    const getTags = async (category: CATEGORIES, page: number) => {
      return datas
        .filter(data => data.category === category)
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;

          return 0;
        })
        .slice(page, page + pageSize);
    };

    const getTagsByPopularity = async (category: CATEGORIES, page: number) => {
      return datas
        .filter(data => data.category === category.toString())
        .sort((a, b) => a.tagged - b.tagged)
        .slice(page, page + pageSize);
    };

    beforeEach(() => {
      datas = generateRandomTags(1000);

      jest
        .spyOn(tagsService, 'getPageCount')
        .mockImplementation(async () => numberOfPages());

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
          total: numberOfPages(),
        },
      };

      expect(
        await tagsController.tags(
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
          total: numberOfPages(),
        },
      };

      expect(
        await tagsController.tags(
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
          .tags(
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
      const randomPage = random.number(numberOfPages());
      const results: TagListEntity = {
        data: await getTags(CATEGORIES.artists, randomPage),
        pagination: {
          page: randomPage,
          total: numberOfPages(),
        },
      };

      expect(
        await tagsController.tags(
          { category: CATEGORIES.artists },
          { page: randomPage },
        ),
      ).toEqual(results);
    });

    it('throws an error when requested page is above total number of pages', async () => {
      await expect(
        tagsController.tags(
          { category: CATEGORIES.artists },
          { page: numberOfPages() },
        ),
      ).resolves.toBeDefined();

      await expect(
        tagsController.tags(
          { category: CATEGORIES.artists },
          { page: numberOfPages() + 1 },
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('byLetter', () => {
    let datas: TagWithCategory[];

    const getTagsByLetter = async (category: CATEGORIES, letter: string) => {
      return datas
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
      datas = generateRandomTags(1000);

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
        tagsController.byLetter({
          category: CATEGORIES.artists,
          letter: 'A',
        }),
      ).resolves.toEqual(results);
    });

    it('returns empty array when letter does not exists', async () => {
      await expect(
        tagsController.byLetter({
          category: CATEGORIES.artists,
          letter: 'not a letter',
        }),
      ).resolves.toEqual([]);
    });
  });
});
