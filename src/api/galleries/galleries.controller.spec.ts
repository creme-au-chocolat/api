jest.mock('./galleries.service');

import { CacheModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HtmlParserModule } from 'src/html-parser/html-parser.module';
import { GalleriesController } from './galleries.controller';
import { GalleriesService } from './galleries.service';

describe('CategoriesController', () => {
  let galleriesController: GalleriesController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GalleriesController],
      providers: [GalleriesService],
      imports: [CacheModule.register({ ttl: 1 }), HtmlParserModule],
    }).compile();

    galleriesController = moduleRef.get(GalleriesController);
  });

  describe('getGalleryById', () => {
    it('Returns gallery details', async () => {
      await expect(
        galleriesController.getGalleryById(
          {
            id: 1,
          },
          {
            filters: '',
          },
        ),
      ).resolves.toMatchSnapshot();

      await expect(
        galleriesController.getGalleryById(
          {
            id: 2,
          },
          {
            filters: '',
          },
        ),
      ).resolves.toMatchSnapshot();

      await expect(
        galleriesController.getGalleryById(
          {
            id: 3,
          },
          {
            filters: '',
          },
        ),
      ).resolves.toMatchSnapshot();
    });

    it('Returns only requested fields', async () => {
      await expect(
        galleriesController.getGalleryById(
          {
            id: 1,
          },
          {
            filters: 'id,thumbnail',
          },
        ),
      ).resolves.toMatchSnapshot();
    });
  });
});
