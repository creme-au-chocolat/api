import { faker } from '@faker-js/faker';
import { CacheModule, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { load } from 'cheerio';
import * as fs from 'fs';
import { FetchMock } from 'jest-fetch-mock';
import fetch from 'node-fetch';
import { HtmlParserModule } from 'src/html-parser/html-parser.module';
import { HtmlParserService } from 'src/html-parser/html-parser/html-parser.service';
import { GalleriesService } from './galleries.service';

const { datatype } = faker;

const fetchMock = (fetch as unknown) as FetchMock;

describe('GalleriesService', () => {
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
      const randomId = datatype.number(999999);

      fetchMock.mockOnce(async () => {
        return {
          url: `https://nhentai.net/g/${randomId}/`,
        };
      });

      await expect(galleriesService.random()).resolves.toBe(randomId);
    });
  });

  describe('thumbnail', () => {
    it('Throws error when it can not find any thumbnail', async () => {
      htmlParserService.parse = jest
        .fn()
        .mockReturnValueOnce(
          load(fs.readFileSync('test/mocks/pages/not-found-page.html')),
        );

      await expect(galleriesService.thumbnail(0)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('page', () => {
    it('Throws error when it can not find the page', async () => {
      htmlParserService.parse = jest
        .fn()
        .mockReturnValueOnce(
          load(fs.readFileSync('test/mocks/pages/not-found-page.html')),
        );

      await expect(galleriesService.page(177013, 1000)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
