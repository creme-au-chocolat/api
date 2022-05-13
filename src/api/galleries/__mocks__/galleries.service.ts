import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { generateRandomGalleryDetails } from 'test/mocks/galleries.mock';
import { GalleryDetailsEntity } from '../types/gallery-details.entity';

const { helpers } = faker;

export const mockedGalleries = generateRandomGalleryDetails(100);

export class GalleriesService {
  async details(id: number): Promise<Required<GalleryDetailsEntity>> {
    return mockedGalleries[id];
  }

  async thumbnail(): Promise<NodeJS.ReadableStream> {
    return fs.createReadStream(
      path.join(__dirname, '../../../../test/mocks/images/thumbnail.jpg'),
    );
  }

  async random(): Promise<number> {
    faker.seed(1);

    return helpers.arrayElement(Object.keys(mockedGalleries).map(key => +key));
  }
}
