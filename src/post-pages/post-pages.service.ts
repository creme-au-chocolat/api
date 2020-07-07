import { Injectable } from '@nestjs/common';
import { HtmlParserService } from '../html-parser/html-parser/html-parser.service';
import { PostComponent } from './types/post-responses.type';

@Injectable()
export class PostPagesService {
  constructor(private readonly htmlParser: HtmlParserService) {}

  fetchPosts(uri: string): Promise<PostComponent[]> {
    return this.htmlParser.mapParse<PostComponent>(uri, '.gallery', element => {
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
      };
    });
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
