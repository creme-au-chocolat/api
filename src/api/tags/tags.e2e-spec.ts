jest.mock('./tags.service');

import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { random, seed } from 'faker';
import * as request from 'supertest';
import { createTestingApp, testRequests } from '../../../test/helpers/e2e';
import { CATEGORIES } from '../../shared/enum/tag-categories.enum';
import { TagDocument } from '../../shared/schemas/tag.schema';
import { TagsModule } from './tags.module';
import { TagsService } from './tags.service';
import {
  mockedTags,
  TagsService as MockedTagsService,
} from './__mocks__/tags.service';

describe('TagsController (e2e)', () => {
  let app: INestApplication;
  let tagsService: TagsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TagsModule],
    })
      .overrideProvider(TagsService)
      .useClass(MockedTagsService)
      .overrideProvider(getModelToken(TagDocument.name))
      .useValue({})
      .compile();

    tagsService = moduleRef.get(TagsService);

    app = createTestingApp(moduleRef);
    await app.init();
  });

  beforeEach(async () => {
    seed(0);
  });

  describe('/tags/list/:category (GET)', () => {
    it('sort by popularity', async () => {
      const response = await request(app.getHttpServer())
        .get('/tags/list/artists?popular=true&page=1')
        .expect(200);

      expect(response.body).toMatchSnapshot();
    });

    it('sort by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/tags/list/artists?popular=false&page=1')
        .expect(200);

      expect(response.body).toMatchSnapshot();
    });

    it('throws 404 error when requested page does not exist', async () => {
      const numberOfPages = await tagsService.getPageCount(CATEGORIES.artists);

      return request(app.getHttpServer())
        .get(`/tags/list/artists?popular=false&page=${numberOfPages + 1}`)
        .expect(404);
    });

    it('throws 400 error on wrong parameters values', async () => {
      const httpServer = app.getHttpServer();
      const badRequests: string[] = [
        '/tags/list/notacategory?popular=false&page=1',
        '/tags/list/artists?popular=false&page=0',
        '/tags/list/artists?popular=false&page=1.50',
        '/tags/list/artists?popular=false&page=notanumber',
        '/tags/list/artists?popular=false&page=-1',
      ];

      await testRequests(httpServer, badRequests, 400);
    });

    it('converts parameters types', async () => {
      const httpServer = app.getHttpServer();

      const shouldOrderByPopularity: string[] = [
        '/tags/list/artists?popular=true&page=1',
        '/tags/list/artists?popular=1&page=1',
        '/tags/list/artists?popular=anything&page=1',
      ];
      const shouldOrderByName: string[] = [
        '/tags/list/artists?popular=false&page=1',
        '/tags/list/artists?page=1',
      ];
      const shouldWorks: string[] = [
        '/tags/list/artists',
        '/tags/list/artists?page=1',
      ];

      for (const req of shouldOrderByPopularity) {
        const response = await request(httpServer)
          .get(req)
          .expect(200);

        expect(response.body).toMatchSnapshot();
      }

      for (const req of shouldOrderByName) {
        const response = await request(httpServer)
          .get(req)
          .expect(200);

        expect(response.body).toMatchSnapshot();
      }

      for (const req of shouldWorks) {
        await request(httpServer)
          .get(req)
          .expect(200);
      }
    });
  });

  describe('/tags/list/:category/:letter (GET)', async () => {
    it('returns all tags starting with specified letter, sorted by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/tags/list/artists/a')
        .expect(200);

      expect(response.body).toMatchSnapshot();
    });

    it('is case insensitive', async () => {
      const lowercaseResponse = await request(app.getHttpServer())
        .get('/tags/list/artists/a')
        .expect(200);

      const uppercaseResponse = await request(app.getHttpServer())
        .get('/tags/list/artists/A')
        .expect(200);

      expect(lowercaseResponse.body).toMatchSnapshot();
      expect(uppercaseResponse.body).toMatchSnapshot();
      expect(uppercaseResponse.body).toStrictEqual(lowercaseResponse.body);
    });

    it('throws 400 error on wrong parameters values', async () => {
      const httpServer = app.getHttpServer();
      const badRequests: string[] = [
        '/tags/list/notacategory/a',
        '/tags/list/artists/notaletter',
      ];

      await testRequests(httpServer, badRequests, 400);
    });
  });

  describe('/tags/details/:id (GET)', () => {
    it('returns requested tag', async () => {
      const randomTag = random.arrayElement(mockedTags);

      const response = await request(app.getHttpServer())
        .get(`/tags/details/${randomTag.id}`)
        .expect(200);

      expect(response.body).toMatchSnapshot();
    });

    it('returns 404 error when tag does not exist', async () => {
      await request(app.getHttpServer())
        .get('/tags/details/999999')
        .expect(404);
    });

    it('validate and convert parameters', async () => {
      const httpServer = app.getHttpServer();
      const badRequests = [
        '/tags/details/0',
        '/tags/details/bite',
        '/tags/details/NaN',
      ];
      const goodRequests = [
        `/tags/details/${random.arrayElement(mockedTags).id}`,
      ];

      await testRequests(httpServer, badRequests, 400);
      await testRequests(httpServer, goodRequests, 200);
    });
  });

  describe('/tags/search (GET)', () => {
    it('returns tags including search query', async () => {
      const response = await request(app.getHttpServer())
        .get('/tags/search?q=ips')
        .expect(200);

      expect(response.body).toMatchSnapshot();
    });

    it('returns tags including search query and category', async () => {
      const response = await request(app.getHttpServer())
        .get('/tags/search?q=ips&category=tags')
        .expect(200);

      expect(response.body).toMatchSnapshot();
    });

    it('returns empty array if nothing found', async () => {
      await request(app.getHttpServer())
        .get('/tags/search?q=impossiblestring')
        .expect(200)
        .expect([]);
    });

    it('validate and convert parameters', async () => {
      const httpServer = app.getHttpServer();
      const badRequests = [
        '/tags/search',
        '/tags/search?q=aa',
        '/tags/search?q=aaa&page=0',
        '/tags/search?q=aaa&page=1.3',
      ];
      const goodRequests = [
        `/tags/search?q=aaa&page=1&category=artists`,
        `/tags/search?q=aaa`,
      ];

      await testRequests(httpServer, badRequests, 400);
      await testRequests(httpServer, goodRequests, 200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
