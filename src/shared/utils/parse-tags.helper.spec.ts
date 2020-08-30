import { load } from 'cheerio';
import * as fs from 'fs';
import { parseTag, parseTags } from './parse-tags.helper';

let $: CheerioStatic;

beforeAll(() => {
  $ = load(fs.readFileSync('test/mocks/pages/page-with-tags.html'));
});

it('Parse a tag element', () => {
  const tagElement = $('#tags .tag').first();

  expect(parseTag(tagElement)).toMatchInlineSnapshot(`
    Object {
      "id": 8010,
      "name": "group",
      "tagged": 72000,
      "uri": "/tag/group/",
    }
  `);
});

it('Parse multiple tags', () => {
  const tags = $('#tags > div:nth-child(6) > .tags > .tag');

  expect(parseTags(tags, $)).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": 17249,
        "name": "translated",
        "tagged": 109000,
        "uri": "/language/translated/",
      },
      Object {
        "id": 12227,
        "name": "english",
        "tagged": 69000,
        "uri": "/language/english/",
      },
    ]
  `);
});
