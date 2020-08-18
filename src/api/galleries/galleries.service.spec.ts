import { CacheModule, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { load } from 'cheerio';
import { random } from 'faker';
import * as fs from 'fs';
import { FetchMock } from 'jest-fetch-mock';
import fetch from 'node-fetch';
import { HtmlParserModule } from 'src/html-parser/html-parser.module';
import { HtmlParserService } from 'src/html-parser/html-parser/html-parser.service';
import { GalleriesService } from './galleries.service';

const fetchMock = (fetch as unknown) as FetchMock;

describe('GalleriesController', () => {
  let galleriesService: GalleriesService;
  let htmlParserService: HtmlParserService;
  let galleryPage: string;

  beforeAll(async () => {
    galleryPage = fs.readFileSync(
      'test/mocks/pages/page-with-tags.html',
      'utf8',
    );
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [GalleriesService],
      imports: [CacheModule.register({ ttl: 1 }), HtmlParserModule],
    }).compile();

    galleriesService = moduleRef.get(GalleriesService);
    htmlParserService = moduleRef.get(HtmlParserService);
  });

  describe('details', () => {
    it('Returns gallery details', async () => {
      htmlParserService.parse = jest
        .fn()
        .mockReturnValueOnce(load(galleryPage));

      await expect(galleriesService.details(177013)).resolves.toMatchSnapshot();
    });

    it('Throws error when gallery does not exist', async () => {
      htmlParserService.parse = jest
        .fn()
        .mockReturnValueOnce(
          load(fs.readFileSync('test/mocks/pages/not-found-page.html')),
        );

      await expect(galleriesService.details(0)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('random', () => {
    it('Returns random page', async () => {
      const randomId = random.number(999999);

      fetchMock.mockIf('https://nhentai.net/random', async () => {
        return {
          url: `https://nhentai.net/g/${randomId}/`,
        };
      });

      await expect(galleriesService.random()).resolves.toBe(randomId);
    });
  });
});
