import { NotFoundException } from '@nestjs/common';
import { filter, orderBy, slice } from 'lodash';
import { CATEGORIES } from '../../src/shared/enum/tag-categories.enum';
import { generateRandomTags } from './tags.mock';

export const mockTags = generateRandomTags(1000);

const getNumberOfPages = (category: CATEGORIES) => {
  const filteredTags = filter(mockTags, ['category', category.toString()]);

  return Math.ceil(filteredTags.length / 120);
};

const sortByPopularity = (category: CATEGORIES, page: number) => {
  const filteredTags = filter(mockTags, ['category', category.toString()]);
  const sortedTags = orderBy(filteredTags, 'tagged', 'desc');
  const slicedTags = slice(
    sortedTags,
    (page - 1) * 120,
    (page - 1) * 120 + 120,
  );

  return slicedTags;
};

const getByLetter = (category: CATEGORIES, letter: string) => {
  const filteredTags = filter(
    mockTags,
    tag =>
      tag.category === category.toString() &&
      tag.name.toLowerCase().startsWith(letter.toLowerCase()),
  );
  const sortedTags = orderBy(filteredTags, 'name', 'asc');

  return sortedTags;
};

const sortByName = (category: CATEGORIES, page: number) => {
  const filteredTags = filter(mockTags, ['category', category.toString()]);
  const sortedTags = orderBy(filteredTags, 'name', 'asc');
  const slicedTags = slice(
    sortedTags,
    (page - 1) * 120,
    (page - 1) * 120 + 120,
  );

  return slicedTags;
};

const search = (searchQuery: string, category?: string) => {
  // TODO
};

const getTagById = (id: number) => {
  const tag = mockTags.find(tag => tag.id === id);

  if (!tag) throw new NotFoundException();

  return tag;
};

const tagsService = {
  getTags: sortByName,
  getTagsByPopularity: sortByPopularity,
  getTagsByLetter: getByLetter,
  getPageCount: getNumberOfPages,
  getTagById,
  search,
};

export { tagsService };
