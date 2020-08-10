import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
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
@UseInterceptors(CacheInterceptor)
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

  @ApiOperation({
    summary: 'search for a tag by name and optionaly by category',
    description:
      'returns a list sorted depending on the position of the search query in the tag name',
  })
  @ApiBadRequestResponse()
  @Get('search')
  async search(@Query() query: SearchCategoryDto): Promise<TagWithCategory[]> {
    return this.tagsService.search(query.q, query.category);
  }
}
