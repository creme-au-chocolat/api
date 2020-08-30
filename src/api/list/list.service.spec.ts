import { CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { load } from 'cheerio';
import * as fs from 'fs';
import { HtmlParserModule } from 'src/html-parser/html-parser.module';
import { HtmlParserService } from 'src/html-parser/html-parser/html-parser.service';
import { ListService } from './list.service';

describe('ListService', () => {
  let listService: ListService;
  let htmlParserService: HtmlParserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [ListService],
      imports: [CacheModule.register({ ttl: 1 }), HtmlParserModule],
    }).compile();

    listService = moduleRef.get(ListService);
    htmlParserService = moduleRef.get(HtmlParserService);
  });

  describe('fetchPosts', () => {
    it('Returns posts in homepage', async () => {
      htmlParserService.parse = jest
        .fn()
        .mockReturnValueOnce(
          load(fs.readFileSync('test/mocks/pages/homepage.html')),
        );

      await expect(
        listService.fetchPosts('https://nhentai.net/', 1),
      ).resolves.toMatchSnapshot();
    });
  });
});
