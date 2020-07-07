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
import { HomepageQuery } from './types/homepage-query.type';
import { HomepageResponse } from './types/homepage-response.type';

@Controller('posts')
@UseInterceptors(CacheInterceptor)
export class PostPagesController {
  constructor(private readonly postPagesService: PostPagesService) {}

  @Get('/search')
  async search(@Query() query: SearchQuery): Promise<PostResponse> {
    const uri = `https://nhentai.net/search/?q=${query.q}&page=${query.page}&sort=${query.sort}`;

    const [posts, pages] = await this.postPagesService.fetchPosts(
      uri,
      query.page,
    );

    return {
      data: posts,
      pagination: {
        page: query.page,
        total: pages,
      },
    };
  }

  @Get('/homepage')
  async homepage(@Query() query: HomepageQuery): Promise<HomepageResponse> {
    const uri = `https://nhentai.net/?page=${query.page}`;

    const [posts, pages] = await this.postPagesService.fetchPosts(
      uri,
      query.page,
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
        total: pages,
      },
    };
  }
}
