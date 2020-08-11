import { HtmlTag } from '../types/html-tag.entity';

export function parseTags(tagsElements: Cheerio, $: CheerioStatic): HtmlTag[] {
  return tagsElements.toArray().map<HtmlTag>(rawElement => {
    const el = $(rawElement);

    return parseTag(el);
  });
}

export function parseTag(tagElement: Cheerio): HtmlTag {
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
