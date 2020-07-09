import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  CacheInterceptor,
  Res,
  Redirect,
  Header,
  CacheTTL,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { DetailsQuery } from './types/details-query.type';
import { PostParam } from './types/post-param.type';
import { DetailsResponse } from './types/details-response.type';
import { Response } from 'express';
import { PageParam } from './types/page-param.type';

@Controller()
@UseInterceptors(CacheInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('g/:id')
  async details(
    @Param() params: PostParam,
    @Query() query: DetailsQuery,
  ): Promise<DetailsResponse> {
    const details = await this.postsService.details(params.id);

    if (query.filters.length) {
      const filteredKeys = Object.keys(details).filter(key =>
        query.filters.includes(key.toLowerCase()),
      );

      const filteredDetails = {};
      filteredKeys.forEach(key => {
        filteredDetails[key] = details[key];
      });

      return filteredDetails;
    } else {
      return details;
    }
  }

  @Get('g/:id/page/:page')
  async page(@Res() res: Response, @Param() params: PageParam): Promise<void> {
    const image = await this.postsService.page(params.id, params.page);

    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
  }

  @Get('g/:id/thumbnail')
  async thumbnail(
    @Res() res: Response,
    @Param() params: PostParam,
  ): Promise<void> {
    const image = await this.postsService.thumbnail(params.id);

    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
  }

  @Get('posts/random')
  @CacheTTL(1)
  @Redirect('/g', 302)
  async random(): Promise<{ url: string }> {
    const randomId = await this.postsService.random();

    return {
      url: `/g/${randomId}`,
    };
  }
}
