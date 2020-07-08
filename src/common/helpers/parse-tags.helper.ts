import { Tag } from '../types/tag.type';

export function parseTags(tagsElements: Cheerio, $: CheerioStatic): Tag[] {
  return tagsElements.toArray().map<Tag>(rawElement => {
    const el = $(rawElement);

    return parseTag(el);
  });
}

export function parseTag(tagElement: Cheerio): Tag {
  return {
    name: tagElement.find('.name').text(),
    tagged: parseInt(
      tagElement
        .find('.count')
        .text()
        .replace('K', '000'),
    ),
    uri: tagElement.attr('href'),
    id: parseInt(tagElement.attr('class').split('tag-')[1]),
  };
}
