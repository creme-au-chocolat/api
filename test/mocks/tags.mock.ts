import { internet, lorem, random, seed } from 'faker';
import { Tag } from 'src/shared/types/tag.entity';

function generateRandomTags(number: number): Tag[] {
  seed(1);

  const tags: Tag[] = [];

  for (let i = 0; i < number; i++) {
    const tag = {
      name: lorem.word(),
      tagged: random.number(),
      uri: internet.url(),
      id: random.number(999998),
      category: random.arrayElement([
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
