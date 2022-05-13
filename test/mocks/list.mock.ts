import { faker } from '@faker-js/faker';
import { PostEntity } from 'src/api/list/types/post.entity';

const { image, lorem, helpers, datatype } = faker;

function generateRandomGalleries(number: number): PostEntity[] {
  faker.seed(1);

  const galleries: PostEntity[] = [];

  for (let i = 0; i < number; i++) {
    const gallery: PostEntity = {
      id: datatype.number(999998),
      name: lorem.sentence(),
      lang: helpers.arrayElement(['EN', 'CN', 'JP', 'unknown', 'none']),
      thumbnail: image.imageUrl(),
      tags: [datatype.number(), datatype.number(), datatype.number()],
    };

    galleries.push(gallery);
  }

  return galleries;
}

export { generateRandomGalleries };
