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
import {
  ApiBadRequestResponse,
  ApiMovedPermanentlyResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('galleries')
@Controller()
@UseInterceptors(CacheInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @Get('g/:id')
  async details(
    @Param() params: GetPostDto,
    @Query() query: GetDetailsDto,
  ): Promise<PostDetailsEntity> {
    const details = await this.postsService.details(params.id);

    if (query.filters.length) {
      // TODO: Strict check
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

  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'page does not exist in gallery' })
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiProduces('image/jpeg')
  @Get('g/:id/page/:page')
  async page(
    @Res() res: Response,
    @Param() params: GetPostPageDto,
  ): Promise<void> {
    const image = await this.postsService.page(params.id, params.page);

    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiProduces('image/jpeg')
  @Get('g/:id/thumbnail')
  async thumbnail(
    @Res() res: Response,
    @Param() params: GetPostDto,
  ): Promise<void> {
    const image = await this.postsService.thumbnail(params.id);

    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiProduces('application/zip')
  @Get('g/:id/download')
  async download(
    @Res() res: Response,
    @Param() params: GetPostDto,
    @Query() query: DownloadPostDto,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/zip');

    this.postsService.download(res, params.id, query.numberOfPages);
  }

  @ApiResponse({
    status: 303,
    description: 'redirect to /g/:id with random post id',
  })
  @Get('posts/random')
  @CacheTTL(1)
  @Redirect('/g', 303)
  async random(): Promise<{ url: string }> {
    const randomId = await this.postsService.random();

    return {
      url: `/g/${randomId}`,
    };
  }
}
