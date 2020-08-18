import { CacheModule, NotFoundException } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { random, seed } from 'faker';
import { Connection } from 'mongoose';
import { Tag } from 'src/shared/types/tag.entity';
import { CATEGORIES } from '../../shared/enum/tag-categories.enum';
import {
  closeMongoConnection,
  DatabaseTestingModule,
} from '../../testing/database-testing/database-testing.module';
import { SeederService } from '../../testing/database-testing/seeder/seeder.service';
import { TagsService } from './tags.service';

describe('CategoriesController', () => {
  let tagsService: TagsService;
  let databaseConnection: Connection;
  let seededWith: Tag[];

  beforeEach(async () => {
    seed(1);

    TagsService.PAGE_SIZE = 10;

    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [TagsService],
      imports: [CacheModule.register({ ttl: 1 }), DatabaseTestingModule],
    }).compile();

    tagsService = moduleRef.get(TagsService);
    databaseConnection = moduleRef.get(getConnectionToken());

    const seedingService = moduleRef.get(SeederService);
    [, seededWith] = await seedingService.seedTags();
  });

  afterEach(async () => {
    await databaseConnection.close();
    await closeMongoConnection();
  });

  describe('getPageCount', () => {
    it('returns correct page count', async () => {
      expect(
        await tagsService.getPageCount(CATEGORIES.artists),
      ).toMatchSnapshot();
    });
  });

  describe('getTagsByPopularity', () => {
    it('returns tags sorted by popularity', async () => {
      await expect(
        tagsService.getTagsByPopularity(CATEGORIES.artists, 1),
      ).resolves.toMatchSnapshot();
    });

    it('works with other pages', async () => {
      await expect(
        tagsService.getTagsByPopularity(CATEGORIES.artists, 2),
      ).resolves.toMatchSnapshot();
    });

    it('returns empty array when page out of range', async () => {
      await expect(
        tagsService.getTagsByPopularity(CATEGORIES.artists, 100000),
      ).resolves.toEqual([]);
    });
  });

  describe('getTagsByLetter', () => {
    it('returns all tags starting with requested letter', async () => {
      await expect(
        tagsService.getTagsByLetter(CATEGORIES.artists, 'A'),
      ).resolves.toMatchSnapshot();
    });

    it('is case insensitive', async () => {
      await expect(
        tagsService.getTagsByLetter(CATEGORIES.artists, 'A'),
      ).resolves.toMatchSnapshot();

      await expect(
        tagsService.getTagsByLetter(CATEGORIES.artists, 'a'),
      ).resolves.toMatchSnapshot();
    });

    it('returns empty array when letter is invalid', async () => {
      await expect(
        tagsService.getTagsByLetter(CATEGORIES.artists, '$'),
      ).resolves.toEqual([]);
    });
  });

  describe('getTags', () => {
    it('returns all tags sorted by name', async () => {
      await expect(
        tagsService.getTags(CATEGORIES.artists, 1),
      ).resolves.toMatchSnapshot();
    });

    it('works with any page', async () => {
      await expect(
        tagsService.getTags(CATEGORIES.artists, 2),
      ).resolves.toMatchSnapshot();
    });

    it('returns empty array when page out of range', async () => {
      await expect(
        tagsService.getTags(CATEGORIES.artists, 100000),
      ).resolves.toEqual([]);
    });
  });

  describe('search', () => {
    it('returns all tags matching search query', async () => {
      await expect(tagsService.search('i', 1)).resolves.toMatchSnapshot();
    });

    it('returns all tags matching search query and category', async () => {
      await expect(
        tagsService.search('i', 1, CATEGORIES.artists),
      ).resolves.toMatchSnapshot();
    });

    it('works with any page', async () => {
      await expect(tagsService.search('i', 2)).resolves.toMatchSnapshot();
    });
  });

  describe('getTagById', () => {
    it('returns requested tag', async () => {
      const randomTag = random.arrayElement(seededWith);

      await expect(
        tagsService.getTagById(randomTag.id),
      ).resolves.toMatchSnapshot();
    });

    it('throw NotFoundException when tag does not exist', async () => {
      await expect(
        tagsService.getTagById(Number.POSITIVE_INFINITY),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
