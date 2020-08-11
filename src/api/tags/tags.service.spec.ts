import { CacheModule, NotFoundException } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { random } from 'faker';
import { filter, orderBy, slice } from 'lodash';
import { Connection } from 'mongoose';
import { CATEGORIES } from '../../common/enum/tag-categories.enum';
import { Tag, TagSchema } from '../../common/schemas/tag.schema';
import { TagWithCategory } from '../../common/types/tag-with-category.entity';
import {
  closeMongoConnection,
  DatabaseTestingModule,
} from '../../testing/database-testing/database-testing.module';
import { SeederService } from '../../testing/database-testing/seeder/seeder.service';
import { TagsService } from './tags.service';

describe('CategoriesController', () => {
  let tagsService: TagsService;
  let databaseConnection: Connection;
  let seededTags: Tag[];
  let seededWith: TagWithCategory[];

  const getNumberOfPages = (category: CATEGORIES) => {
    const filteredTags = seededTags.filter(tag => tag.category === category);
    return Math.ceil(filteredTags.length / pageSize);
  };

  const pageSize = 120;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [TagsService],
      imports: [
        CacheModule.register({ ttl: 1 }),
        DatabaseTestingModule,
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
      ],
    }).compile();

    tagsService = moduleRef.get(TagsService);
    databaseConnection = moduleRef.get(getConnectionToken());

    const seedingService = moduleRef.get(SeederService);
    [seededTags, seededWith] = await seedingService.seedTags();
  });

  afterEach(async () => {
    await databaseConnection.close();
    await closeMongoConnection();
  });

  describe('getPageCount', () => {
    it('returns correct page count', async () => {
      const numberOfPages = getNumberOfPages(CATEGORIES.artists);

      expect(await tagsService.getPageCount(CATEGORIES.artists)).toBe(
        numberOfPages,
      );
    });
  });

  describe('getTagsByPopularity', () => {
    const processTags = (sliceStart: number, sliceEnd: number) => {
      const filteredTags = filter(seededWith, [
        'category',
        CATEGORIES.artists.toString(),
      ]);
      const sortedTags = orderBy(filteredTags, 'tagged', 'desc');
      const slicedTags = slice(sortedTags, sliceStart, sliceEnd);

      return slicedTags;
    };

    it('returns tags sorted by popularity', async () => {
      const result = processTags(0, pageSize);

      await expect(
        tagsService
          .getTagsByPopularity(CATEGORIES.artists, 1)
          .then(tags => JSON.stringify(tags)),
      ).resolves.toBe(JSON.stringify(result));
    });

    it('works with random page', async () => {
      const numberOfPages = getNumberOfPages(CATEGORIES.artists);
      const randomPage = random.number({ min: 1, max: numberOfPages });

      const result = processTags(
        (randomPage - 1) * pageSize,
        (randomPage - 1) * pageSize + pageSize,
      );

      await expect(
        tagsService
          .getTagsByPopularity(CATEGORIES.artists, randomPage)
          .then(tags => JSON.stringify(tags)),
      ).resolves.toBe(JSON.stringify(result));
    });

    it('returns empty array when page out of range', async () => {
      const numberOfPages = getNumberOfPages(CATEGORIES.artists);

      await expect(
        tagsService.getTagsByPopularity(CATEGORIES.artists, numberOfPages + 1),
      ).resolves.toEqual([]);
    });
  });

  describe('getTagsByLetter', () => {
    const processTags = (letter: string) => {
      const filteredTags = filter(
        seededWith,
        tag =>
          tag.category === CATEGORIES.artists.toString() &&
          tag.name.toLowerCase().startsWith(letter.toLowerCase()),
      );
      const sortedTags = orderBy(filteredTags, 'name', 'asc');

      return sortedTags;
    };

    it('returns all tags starting with requested letter', async () => {
      const result = processTags('F');

      await expect(
        tagsService
          .getTagsByLetter(CATEGORIES.artists, 'F')
          .then(tags => JSON.stringify(tags)),
      ).resolves.toBe(JSON.stringify(result));
    });

    it('is case insensitive', async () => {
      const result = processTags('F');

      await expect(
        tagsService
          .getTagsByLetter(CATEGORIES.artists, 'F')
          .then(tags => JSON.stringify(tags)),
      ).resolves.toBe(JSON.stringify(result));

      await expect(
        tagsService
          .getTagsByLetter(CATEGORIES.artists, 'f')
          .then(tags => JSON.stringify(tags)),
      ).resolves.toBe(JSON.stringify(result));
    });

    it('returns empty array when letter is invalid', async () => {
      const result = [];

      await expect(
        tagsService.getTagsByLetter(CATEGORIES.artists, '$'),
      ).resolves.toEqual(result);
    });
  });

  describe('getTags', () => {
    const processTags = (sliceStart: number, sliceEnd: number) => {
      const filteredTags = filter(seededWith, [
        'category',
        CATEGORIES.artists.toString(),
      ]);
      const sortedTags = orderBy(filteredTags, 'name', 'asc');
      const slicedTags = slice(sortedTags, sliceStart, sliceEnd);

      return slicedTags;
    };

    it('returns all tags sorted by name', async () => {
      const result = processTags(0, pageSize);

      await expect(
        tagsService
          .getTags(CATEGORIES.artists, 1)
          .then(tags => JSON.stringify(tags)),
      ).resolves.toBe(JSON.stringify(result));
    });

    it('works with random page', async () => {
      const numberOfPages = getNumberOfPages(CATEGORIES.artists);
      const randomPage = random.number({ min: 1, max: numberOfPages });

      const result = processTags(
        (randomPage - 1) * pageSize,
        (randomPage - 1) * pageSize + pageSize,
      );

      await expect(
        tagsService
          .getTags(CATEGORIES.artists, randomPage)
          .then(tags => JSON.stringify(tags)),
      ).resolves.toBe(JSON.stringify(result));
    });

    it('returns empty array when page out of range', async () => {
      const numberOfPages = getNumberOfPages(CATEGORIES.artists);

      await expect(
        tagsService.getTags(CATEGORIES.artists, numberOfPages + 1),
      ).resolves.toEqual([]);
    });
  });

  describe('search', () => {
    const processTags = (query: string, category?: CATEGORIES) => {
      const filteredTags = seededWith.filter(tag => {
        const nameRegexp = new RegExp(`^.*${query}.*$`);

        if (category === undefined) return nameRegexp.test(tag.name);

        return (
          nameRegexp.test(tag.name) && tag.category === category.toString()
        );
      });
      const orderedTags = filteredTags.sort((a, b) => {
        const aName = a.name;
        const bName = b.name;

        return aName.indexOf(query) - bName.indexOf(query);
      });
      const slicedTags = orderedTags.slice(0, 10);

      return slicedTags;
    };

    it.skip('returns all tags matching search query', async () => {
      const result = processTags('ab');

      await expect(tagsService.search('ab')).resolves.toStrictEqual(result);
    });

    it.todo('returns all tags matching search query and category');
  });

  describe('getTagById', () => {
    it('returns requested tag', async () => {
      const randomTag = random.arrayElement(seededWith);

      await expect(
        tagsService.getTagById(randomTag.id).then(tag => JSON.stringify(tag)),
      ).resolves.toBe(JSON.stringify(randomTag));
    });

    it('throw NotFoundException when tag does not exist', async () => {
      await expect(
        tagsService.getTagById(Number.POSITIVE_INFINITY),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
