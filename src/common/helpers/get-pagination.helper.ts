export function getPages($: CheerioStatic, fallback: number): number {
  const lastPageArrow = $('.pagination > .last');
  let numberOfPages = fallback;

  if (lastPageArrow.attr('href')) {
    const href = lastPageArrow.attr('href').split('=');
    numberOfPages = parseInt(href[href.length - 1]);
  }

  return numberOfPages;
}
