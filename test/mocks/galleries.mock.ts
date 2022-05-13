import { faker } from '@faker-js/faker';
import { GalleryDetailsEntity } from 'src/api/galleries/types/gallery-details.entity';
import { HtmlTag } from 'src/shared/types/html-tag.entity';

const { date, internet, lorem, datatype } = faker;

function generateRandomGalleryDetails(
  number: number,
): Record<number, Required<GalleryDetailsEntity>> {
  faker.seed(1);

  const galleries: Record<number, Required<GalleryDetailsEntity>> = {};

  for (let i = 0; i < number; i++) {
    const gallery: Required<GalleryDetailsEntity> = {
      id: i,
      internalId: datatype.number(999998),
      pages: datatype.number(),
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
      tagged: datatype.number(),
      id: datatype.number(999998),
      uri: internet.url(),
    };

    tags.push(tag);
  }

  return tags;
}

export { generateRandomGalleryDetails };
