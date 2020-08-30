import { load } from 'cheerio';
import * as fs from 'fs';
import { getPages } from './get-pagination.helper';

it('Returns number of pages', () => {
  const $ = load(fs.readFileSync('test/mocks/pages/page-with-pagination.html'));

  expect(getPages($, 0)).toMatchInlineSnapshot(`24`);
});

it('Returns fallback when number of pages can not be found', () => {
  const $ = load('');

  expect(getPages($, 100)).toBe(100);
});
