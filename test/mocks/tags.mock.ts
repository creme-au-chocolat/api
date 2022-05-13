import { faker } from '@faker-js/faker';
import { Tag } from 'src/shared/types/tag.entity';

const { internet, lorem, helpers, datatype } = faker;

function generateRandomTags(number: number): Tag[] {
  faker.seed(1);

  const tags: Tag[] = [];

  for (let i = 0; i < number; i++) {
    const tag = {
      name: lorem.word(),
      tagged: datatype.number(),
      uri: internet.url(),
      id: datatype.number(999998),
      category: helpers.arrayElement([
        'tags',
        'artists',
        'characters',
        'parodies',
        'groups',
      ]),
    };

    tags.push(tag);
  }

  return tags;
}

export { generateRandomTags };
