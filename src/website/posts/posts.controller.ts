import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  CacheInterceptor,
  Res,
  Redirect,
  CacheTTL,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetDetailsDto } from './types/get-details.dto';
import { GetPostDto } from './types/get-post.dto';
import { PostDetailsEntity } from './types/post-details.entity';
import { Response } from 'express';
import { GetPostPageDto } from './types/get-post-page.dto';
import { DownloadPostDto } from './types/download-post.dto';

@Controller()
@UseInterceptors(CacheInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('g/:id')
  async details(
    @Param() params: GetPostDto,
    @Query() query: GetDetailsDto,
  ): Promise<PostDetailsEntity> {
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
  async page(
    @Res() res: Response,
    @Param() params: GetPostPageDto,
  ): Promise<void> {
    const image = await this.postsService.page(params.id, params.page);

    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
  }

  @Get('g/:id/thumbnail')
  async thumbnail(
    @Res() res: Response,
    @Param() params: GetPostDto,
  ): Promise<void> {
    const image = await this.postsService.thumbnail(params.id);

    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
  }

  @Get('g/:id/download')
  async download(
    @Res() res: Response,
    @Param() params: GetPostDto,
    @Query() query: DownloadPostDto,
  ): Promise<void> {
    const archive = await this.postsService.download(params.id, query.page);

    res.setHeader('Content-Type', 'application/zip');
    archive.pipe(res);
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
