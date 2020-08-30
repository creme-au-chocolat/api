import { image, lorem, random, seed } from 'faker';
import { PostEntity } from 'src/api/list/types/post.entity';

function generateRandomGalleries(number: number): PostEntity[] {
  seed(1);

  const galleries: PostEntity[] = [];

  for (let i = 0; i < number; i++) {
    const gallery: PostEntity = {
      id: random.number(999998),
      name: lorem.sentence(),
      lang: random.arrayElement(['EN', 'CN', 'JP', 'unknown', 'none']),
      thumbnail: image.imageUrl(),
      tags: [random.number(), random.number(), random.number()],
    };

    galleries.push(gallery);
  }

  return galleries;
}

export { generateRandomGalleries };
