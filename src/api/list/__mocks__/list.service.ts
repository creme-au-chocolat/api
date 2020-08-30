import { generateRandomGalleries } from 'test/mocks/list.mock';
import { PostEntity } from '../types/post.entity';

export const mockedGalleries = generateRandomGalleries(100);

export class ListService {
  private readonly PAGE_SIZE = 10;

  async fetchPosts(_: string, page: number): Promise<[PostEntity[], number]> {
    const galleries = mockedGalleries.slice(
      this.PAGE_SIZE * page,
      this.PAGE_SIZE * page + this.PAGE_SIZE,
    );

    const totalNumberOfPages = mockedGalleries.length / this.PAGE_SIZE;

    return [galleries, totalNumberOfPages];
  }
}
