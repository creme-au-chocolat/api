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
import * as FileType from 'file-type';
import { GalleriesService } from './galleries.service';
import { DownloadGalleryDto } from './types/download-gallery.dto';
import { GalleryDetailsEntity } from './types/gallery-details.entity';
import { GetDetailsDto } from './types/get-details.dto';
import { GetGalleryPageDto } from './types/get-gallery-page.dto';
import { GetGalleryDto } from './types/get-gallery.dto';

@ApiTags('galleries')
@Controller('g')
@UseInterceptors(CacheInterceptor)
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @ApiResponse({
    status: 303,
    description: 'redirect to /g/:id with random gallery id',
  })
  @ApiOperation({
    summary: 'get a random gallery',
    description: 'can be chained with other routes (example: /g/r/thumbnail)',
  })
  @Get('r(/*)?')
  @CacheTTL(1)
  async getRandomGallery(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const randomId = await this.galleriesService.random();

    const ressource = req.url.split('r/')[1] ?? '';

    res.setHeader('Cache-Control', 'no-cache');

    res.redirect(`/g/${randomId}/${ressource}`);
  }

  @ApiOperation({
    summary: 'get details for a gallery',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @Get(':id')
  async getGalleryById(
    @Param() params: GetGalleryDto,
    @Query() query: GetDetailsDto,
  ): Promise<GalleryDetailsEntity> {
    const details = await this.galleriesService.details(params.id);

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
  @Get(':id/page/:page')
  async getGalleryPage(
    @Res() res: Response,
    @Param() params: GetGalleryPageDto,
  ): Promise<void> {
    const image = await this.galleriesService.page(params.id, params.page);

    const imageStreamWithType = await FileType.stream(image as any);

    res.setHeader(
      'Content-Disposition',
      `inline; filename="${params.id}.${imageStreamWithType.fileType.ext}"`,
    );
    res.setHeader('Content-Type', imageStreamWithType.fileType.mime);

    imageStreamWithType.pipe(res);
  }

  @ApiOperation({
    summary: 'get thumbnail for a gallery in jpeg format',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiProduces('image/jpeg')
  @Get(':id/thumbnail')
  async getGalleryThumbnail(
    @Res() res: Response,
    @Param() params: GetGalleryDto,
  ): Promise<void> {
    const image = await this.galleriesService.thumbnail(params.id);

    const imageStreamWithType = await FileType.stream(image as any);

    res.setHeader(
      'Content-Disposition',
      `inline; filename="${params.id}.${imageStreamWithType.fileType.ext}"`,
    );
    res.setHeader('Content-Type', imageStreamWithType.fileType.mime);

    imageStreamWithType.pipe(res);
  }

  @ApiOperation({
    summary: 'download specified number of pages for a gallery in a zip file',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no gallery with provided id' })
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiProduces('application/zip')
  @Get(':id/download')
  async getGalleryAsZip(
    @Res() res: Response,
    @Param() params: GetGalleryDto,
    @Query() query: DownloadGalleryDto,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${params.id}.zip`,
    );

    this.galleriesService.download(res, params.id, query.numberOfPages);
  }
}
