import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  NotFoundException,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ListService } from './list.service';
import { GetHomepageDto } from './types/get-homepage.dto';
import { HomepageEntity } from './types/homepage.entity';
import { PostListEntity } from './types/post-list.entity';
import { SearchPostDto } from './types/search-post.dto';
import { SearchRandomPostDto } from './types/search-random-post.dto';

@ApiTags('list')
@Controller('list')
@UseInterceptors(CacheInterceptor)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiOperation({
    summary: 'use nhentai search feature ',
    description:
      'for advanced use see [https://nhentai.net/info/](https://nhentai.net/info/)',
  })
  @ApiBadRequestResponse()
  @Get('/search')
  async searchGalleries(
    @Query() query: SearchPostDto,
  ): Promise<PostListEntity> {
    const uri = `https://nhentai.net/search/?q=${query.q}&sort=${query.sort}&page=${query.page}`;

    const [posts, pages] = await this.listService.fetchPosts(uri, query.page);

    return {
      data: posts,
      pagination: {
        page: query.page,
        total: pages,
      },
    };
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery found' })
  @ApiResponse({
    status: 303,
    description: 'redirect to random post on nhentai',
  })
  @CacheTTL(1)
  @ApiOperation({
    summary: 'get a random post corresponding to a search query',
  })
  @Get('/randomsearch')
  async searchRandomGallery(
    @Res() res: Response,
    @Query() query: SearchRandomPostDto,
  ): Promise<void> {
    const [, numberOfPages] = await this.listService.fetchPosts(
      `https://nhentai.net/search/?q=${query.q}`,
      1,
    );

    const randomPage = Math.ceil(Math.random() * numberOfPages);

    const [randomPostList] = await this.listService.fetchPosts(
      `https://nhentai.net/search/?q=${query.q}&page=${randomPage}`,
      randomPage,
    );

    const randomPostIndex = Math.round(
      Math.random() * (randomPostList.length - 1),
    );
    const randomPost = randomPostList[randomPostIndex];

    if (!randomPost) {
      throw new NotFoundException();
    }

    if (query.redirect) {
      res.setHeader('Cache-Control', 'no-cache');

      res.redirect(303, `https://nhentai.net/g/${randomPost.id}`);
    } else {
      res.json(randomPost);
    }
  }

  @ApiOperation({ summary: 'get posts in nhentai homepage ' })
  @Get('/homepage')
  async getHomepage(@Query() query: GetHomepageDto): Promise<HomepageEntity> {
    const uri = `https://nhentai.net/?page=${query.page}`;

    const [posts, pages] = await this.listService.fetchPosts(uri, query.page);

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
