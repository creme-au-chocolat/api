import { Injectable } from '@nestjs/common';
import { HtmlParserService } from '../../html-parser/html-parser/html-parser.service';
import { getPages } from '../../shared/helpers/get-pagination.helper';
import { PostEntity } from './types/post.entity';

@Injectable()
export class PostPagesService {
  constructor(private readonly htmlParser: HtmlParserService) {}

  async fetchPosts(uri: string, page: number): Promise<[PostEntity[], number]> {
    const $ = await this.htmlParser.parse(uri);

    const posts = $('.gallery')
      .toArray()
      .map<PostEntity>(rawElement => {
        const element = $(rawElement);

        return {
          id: parseInt(
            element
              .find('a')
              .attr('href')
              .split('/')[2],
          ),
          name: element.find('.caption').text(),
          thumbnail: element.find('img').attr('data-src'),
          lang: this.mapTagsIdToLanguage(element.attr('data-tags')),
          tags: element
            .attr('data-tags')
            .split(' ')
            .map(tag => parseInt(tag)),
        };
      });

    const pages = getPages($, page);

    return [posts, pages];
  }

  private mapTagsIdToLanguage(tags: string): string {
    const langTags = tags.split(' ');

    if (langTags.includes('6346')) {
      return 'JP';
    } else if (langTags.includes('29963')) {
      return 'CN';
    } else if (langTags.includes('12227')) {
      return 'EN';
    } else if (langTags.includes('33680')) {
      return 'none';
    }

    return 'unknown';
  }
}
