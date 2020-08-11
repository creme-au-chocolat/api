import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PostsService } from './posts.service';
import { DownloadPostDto } from './types/download-post.dto';
import { GetDetailsDto } from './types/get-details.dto';
import { GetPostPageDto } from './types/get-post-page.dto';
import { GetPostDto } from './types/get-post.dto';
import { PostDetailsEntity } from './types/post-details.entity';

@ApiTags('galleries')
@Controller()
@UseInterceptors(CacheInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'get details for a gallery',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @Get('g/:id')
  async getGalleryById(
    @Param() params: GetPostDto,
    @Query() query: GetDetailsDto,
  ): Promise<PostDetailsEntity> {
    const details = await this.postsService.details(params.id);

    if (query.filters.length) {
      const filteredKeys = Object.keys(details).filter(key =>
        new RegExp(`(,|^)${key}(,|$)`, 'gi').test(query.filters),
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

  @ApiOperation({
    summary: 'get page of a gallery in jpeg format',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'page does not exist in gallery' })
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiProduces('image/jpeg')
  @Get('g/:id/page/:page')
  async getGalleryPage(
    @Res() res: Response,
    @Param() params: GetPostPageDto,
  ): Promise<void> {
    const image = await this.postsService.page(params.id, params.page);

    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
  }

  @ApiOperation({
    summary: 'get thumbnail for a gallery in jpeg format',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiProduces('image/jpeg')
  @Get('g/:id/thumbnail')
  async getGalleryThumbnail(
    @Res() res: Response,
    @Param() params: GetPostDto,
  ): Promise<void> {
    const image = await this.postsService.thumbnail(params.id);

    res.setHeader('Content-Type', 'image/jpeg');
    image.pipe(res);
  }

  @ApiOperation({
    summary: 'download specified number of pages for a gallery in a zip file',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiProduces('application/zip')
  @Get('g/:id/download')
  async getGalleryAsZip(
    @Res() res: Response,
    @Param() params: GetPostDto,
    @Query() query: DownloadPostDto,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${params.id}.zip`,
    );

    this.postsService.download(res, params.id, query.numberOfPages);
  }

  @ApiResponse({
    status: 303,
    description: 'redirect to /g/:id with random post id',
  })
  @ApiOperation({
    summary: 'get a random gallery',
    description:
      'can be chained with other routes (example: /posts/random/thumbnail',
  })
  @Get('posts/random(/*)?')
  @CacheTTL(1)
  async getRandomGallery(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const randomId = await this.postsService.random();

    const ressource = req.url.split('random/')[1] ?? '';

    res.setHeader('Cache-Control', 'no-cache');

    res.redirect(`/g/${randomId}/${ressource}`);
  }
}
