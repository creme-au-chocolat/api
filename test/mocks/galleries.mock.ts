import { date, internet, lorem, random, seed } from 'faker';
import { GalleryDetailsEntity } from 'src/api/galleries/types/gallery-details.entity';
import { HtmlTag } from 'src/shared/types/html-tag.entity';

function generateRandomGalleryDetails(
  number: number,
): Record<number, Required<GalleryDetailsEntity>> {
  seed(1);

  const galleries: Record<number, Required<GalleryDetailsEntity>> = {};

  for (let i = 0; i < number; i++) {
    const gallery: Required<GalleryDetailsEntity> = {
      id: i,
      internalId: random.number(999998),
      pages: random.number(),
      uploadDate: date.past(1, '2020-10-27T11:05:28.803Z').toISOString(),
      thumbnail: internet.url(),
      name: {
        before: lorem.words(),
        after: lorem.words(),
        content: lorem.sentence(),
      },
      artists: generateRandomTags(3),
      categories: generateRandomTags(3),
      characters: generateRandomTags(3),
      groups: generateRandomTags(3),
      languages: generateRandomTags(3),
      parodies: generateRandomTags(3),
      tags: generateRandomTags(3),
    };

    galleries[i] = gallery;
  }

  return galleries;
}

function generateRandomTags(number: number): HtmlTag[] {
  const tags: HtmlTag[] = [];

  for (let i = 0; i < number; i++) {
    const tag: HtmlTag = {
      name: lorem.word(),
      tagged: random.number(),
      id: random.number(999998),
      uri: internet.url(),
    };

    tags.push(tag);
  }

  return tags;
}

export { generateRandomGalleryDetails };
