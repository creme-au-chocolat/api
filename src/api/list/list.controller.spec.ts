jest.mock('./list.service');

import { CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { seed } from 'faker';
import { HtmlParserModule } from 'src/html-parser/html-parser.module';
import { ListController } from './list.controller';
import { ListService } from './list.service';

describe('CategoriesController', () => {
  let listController: ListController;

  beforeEach(async () => {
    seed(1);

    const moduleRef = await Test.createTestingModule({
      controllers: [ListController],
      providers: [ListService],
      imports: [CacheModule.register({ ttl: 1 }), HtmlParserModule],
    }).compile();

    listController = moduleRef.get(ListController);
  });

  describe('getHomepage', () => {
    it('Returns popular and recent in first page', async () => {
      await expect(
        listController.getHomepage({
          page: 1,
        }),
      ).resolves.toMatchSnapshot();
    });

    it('Returns only recent in other pages', async () => {
      await expect(
        listController.getHomepage({
          page: 2,
        }),
      ).resolves.toMatchSnapshot();
    });
  });
});
