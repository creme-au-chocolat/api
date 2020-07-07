import {
  Controller,
  Get,
  UseInterceptors,
  CacheInterceptor,
  Query,
} from '@nestjs/common';
import { PostPagesService } from './post-pages.service';
import { SearchQuery } from './types/search-query.type';
import { PostResponse } from './types/post-responses.type';
import { Query as QueryType } from './types/query.type';
import { PagesResponse } from '../categories/types/pages-response.type';
import { PageQuery } from './types/page-query.type';
import { HomepageResponse } from './types/homepage-response.type';

@Controller('posts')
@UseInterceptors(CacheInterceptor)
export class PostPagesController {
  constructor(private readonly postPagesService: PostPagesService) {}

  @Get('/search')
  async search(@Query() query: SearchQuery): Promise<PostResponse> {
    const posts = await this.postPagesService.fetchPosts(
      `https://nhentai.net/search/?q=${query.q}&page=${query.page}`,
    );

    return {
      data: posts,
      pagination: {
        page: query.page,
      },
    };
  }

  @Get('/pages')
  async pages(@Query() query: QueryType): Promise<PagesResponse> {
    return this.postPagesService.getPostsPages(
      `https://nhentai.net/search/?q=${query.q}`,
    );
  }

  @Get('/homepage')
  async homepage(@Query() query: PageQuery): Promise<HomepageResponse> {
    const posts = await this.postPagesService.fetchPosts(
      `https://nhentai.net/?page=${query.page}`,
    );

    const popular = query.page === 1 ? posts.slice(0, 5) : [];
    const recent = query.page === 1 ? posts.slice(5) : posts;

    return {
      data: {
        popular,
        recent,
      },
      pagination: {
        page: query.page,
      },
    };
  }
}
