import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { DetailsQuery } from './types/details-query.type';
import { PostParam } from './types/post-param.type';
import { DetailsResponse } from './types/details-response.type';

@Controller('g')
@UseInterceptors(CacheInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  async pages(
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
}
