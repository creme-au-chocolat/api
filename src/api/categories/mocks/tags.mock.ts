import { internet, lorem, random } from 'faker';
import { TagWithCategory } from '../../common/types/tag-with-category.entity';

function generateRandomTags(number: number): TagWithCategory[] {
  const tags: TagWithCategory[] = [];

  for (let i = 0; i < number; i++) {
    const tag = {
      name: lorem.word(),
      tagged: random.number(),
      uri: internet.url(),
      id: random.number(999999),
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
