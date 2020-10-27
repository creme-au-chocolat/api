import { random, seed } from 'faker';
import * as fs from 'fs';
import * as path from 'path';
import { generateRandomGalleryDetails } from 'test/mocks/galleries.mock';
import { GalleryDetailsEntity } from '../types/gallery-details.entity';

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
    seed(1);

    return random.arrayElement(Object.keys(mockedGalleries).map(key => +key));
  }
}
