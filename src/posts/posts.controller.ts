import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostParam } from './models/post-param';
import { DetailsResponse } from './models/details-response';
import { PostsService } from './posts.service';
import { DetailsQuery } from './models/details-query';

@Controller('g')
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
