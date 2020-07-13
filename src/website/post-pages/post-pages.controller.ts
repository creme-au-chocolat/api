import {
  Controller,
  Get,
  UseInterceptors,
  CacheInterceptor,
  Query,
} from '@nestjs/common';
import { PostPagesService } from './post-pages.service';
import { SearchPostDto } from './types/search-post.dto';
import { PostListEntity } from './types/post-list.entity';
import { GetHomepageDto } from './types/get-homepage.dto';
import { HomepageEntity } from './types/homepage.entity';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('post list')
@Controller('posts')
@UseInterceptors(CacheInterceptor)
export class PostPagesController {
  constructor(private readonly postPagesService: PostPagesService) {}

  @ApiBadRequestResponse()
  @Get('/search')
  async search(@Query() query: SearchPostDto): Promise<PostListEntity> {
    const uri = `https://nhentai.net/search/?q=${query.q}&sort=${query.sort}&page=${query.page}`;

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
  async homepage(@Query() query: GetHomepageDto): Promise<HomepageEntity> {
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
