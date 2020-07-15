import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TagWithCategory } from '../../common/types/tag-with-category.entity';
import { TagsService } from './tags.service';
import { GetTagByIdDto } from './types/get-tag-by-id.dto';
import { SearchCategoryDto } from './types/search-category.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({
    summary: 'get tag infos for requested id',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no tag found with this id' })
  @Get('details/:id')
  async byId(@Param() params: GetTagByIdDto): Promise<TagWithCategory> {
    return this.tagsService.getTagById(params.id);
  }

  @Get('search')
  async search(@Query() query: SearchCategoryDto): Promise<TagWithCategory[]> {
    return this.tagsService.search(query.q, query.category);
  }
}
