import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { curry, filter, orderBy, slice } from 'lodash';
import * as request from 'supertest';
import { CategoriesModule } from '../src/api/categories/categories.module';
import { CategoriesService } from '../src/api/categories/categories.service';
import { generateRandomTags } from '../src/api/categories/mocks/tags.mock';
import { CATEGORIES } from '../src/common/enum/tag-categories.enum';
import { Tag } from '../src/common/schemas/tag.schema';
import { createTestingApp, testBadRequests } from './helpers/e2e';

const datas = generateRandomTags(1000);

const getNumberOfPages = (category: CATEGORIES) => {
  const filteredTags = filter(datas, ['category', category.toString()]);

  return Math.ceil(filteredTags.length / 120);
};

const sortByPopularity = (category: CATEGORIES, page: number) => {
  const filteredTags = filter(datas, ['category', category.toString()]);
  const sortedTags = orderBy(filteredTags, 'tagged', 'desc');
  const slicedTags = slice(
    sortedTags,
    (page - 1) * 120,
    (page - 1) * 120 + 120,
  );

  return slicedTags;
};

const getByLetter = (category: CATEGORIES, letter: string) => {
  const filteredTags = filter(
    datas,
    tag =>
      tag.category === category.toString() &&
      tag.name.toLowerCase().startsWith(letter.toLowerCase()),
  );
  const sortedTags = orderBy(filteredTags, 'name', 'asc');

  return sortedTags;
};

const sortByName = (category: CATEGORIES, page: number) => {
  const filteredTags = filter(datas, ['category', category.toString()]);
  const sortedTags = orderBy(filteredTags, 'name', 'asc');
  const slicedTags = slice(
    sortedTags,
    (page - 1) * 120,
    (page - 1) * 120 + 120,
  );

  return slicedTags;
};

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  const categoriesService = {
    getTagsByPopularity: sortByPopularity,
    getTags: sortByName,
    getPageCount: getNumberOfPages,
    getTagsByLetter: getByLetter,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CategoriesModule],
    })
      .overrideProvider(CategoriesService)
      .useValue(categoriesService)
      .overrideProvider(getModelToken(Tag.name))
      .useValue({})
      .compile();

    app = createTestingApp(moduleRef);
    await app.init();
  });

  describe('/categories/:category/tags (GET)', () => {
    it('sort by popularity', () => {
      const result = categoriesService.getTagsByPopularity(
        CATEGORIES.artists,
        1,
      );

      return request(app.getHttpServer())
        .get('/categories/artists/tags?popular=true&page=1')
        .expect(200)
        .expect({
          data: result,
          pagination: {
            page: 1,
            total: categoriesService.getPageCount(CATEGORIES.artists),
          },
        });
    });

    it('sort by name', () => {
      const result = categoriesService.getTags(CATEGORIES.artists, 1);

      return request(app.getHttpServer())
        .get('/categories/artists/tags?popular=false&page=1')
        .expect(200)
        .expect({
          data: result,
          pagination: {
            page: 1,
            total: categoriesService.getPageCount(CATEGORIES.artists),
          },
        });
    });

    it('throws 404 error when requested page does not exist', async () => {
      const numberOfPages = categoriesService.getPageCount(CATEGORIES.artists);

      return request(app.getHttpServer())
        .get(`/categories/artists/tags?popular=false&page=${numberOfPages + 1}`)
        .expect(404);
    });

    it('throws 400 error on wrong parameters values', async () => {
      const httpServer = app.getHttpServer();
      const badRequests: string[] = [
        '/categories/notacategory/tags?popular=false&page=1',
        '/categories/artists/tags?popular=false&page=0',
        '/categories/artists/tags?popular=false&page=1.50',
        '/categories/artists/tags?popular=false&page=notanumber',
        '/categories/artists/tags?popular=false&page=-1',
      ];

      await testBadRequests(httpServer, badRequests);
    });

    it('converts parameters types', async () => {
      const httpServer = app.getHttpServer();
      const byPopularity = curry(categoriesService.getTagsByPopularity)(
        CATEGORIES.artists,
      );
      const byName = curry(categoriesService.getTags)(CATEGORIES.artists);

      const shouldOrderByPopularity: string[] = [
        '/categories/artists/tags?popular=true&page=1',
        '/categories/artists/tags?popular=1&page=1',
        '/categories/artists/tags?popular=anything&page=1',
      ];
      const shouldOrderByName: string[] = [
        '/categories/artists/tags?popular=false&page=1',
        '/categories/artists/tags?page=1',
      ];
      const shouldWorks: string[] = [
        '/categories/artists/tags',
        '/categories/artists/tags?page=1',
      ];

      for (const req of shouldOrderByPopularity) {
        await request(httpServer)
          .get(req)
          .expect(200)
          .then(res => {
            expect(res.body.data).toStrictEqual(byPopularity(1));
          });
      }

      for (const req of shouldOrderByName) {
        await request(httpServer)
          .get(req)
          .expect(200)
          .then(res => {
            expect(res.body.data).toStrictEqual(byName(1));
          });
      }

      for (const req of shouldWorks) {
        await request(httpServer)
          .get(req)
          .expect(200);
      }
    });
  });

  describe('/categories/:category/tags/:letter', () => {
    it('returns all tags starting with specified letter, sorted by name', async () => {
      const result = categoriesService.getTagsByLetter(CATEGORIES.artists, 'A');

      return request(app.getHttpServer())
        .get('/categories/artists/tags/a')
        .expect(200)
        .expect(result);
    });

    it('is case insensitive', async () => {
      const result = categoriesService.getTagsByLetter(CATEGORIES.artists, 'A');

      await request(app.getHttpServer())
        .get('/categories/artists/tags/a')
        .expect(200)
        .expect(result);

      await request(app.getHttpServer())
        .get('/categories/artists/tags/A')
        .expect(200)
        .expect(result);
    });

    it('throws 400 error on wrong parameters values', async () => {
      const httpServer = app.getHttpServer();
      const badRequests: string[] = [
        '/categories/notacategory/tags/a',
        '/categories/notacategory/tags/notaletter',
        '/categories/notacategory/tags/0',
      ];

      await testBadRequests(httpServer, badRequests);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
