import {
  CacheInterceptor,
  Controller,
  Get,
  NotFoundException,
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
import { Tag } from 'src/shared/types/tag.entity';
import { CATEGORIES } from '../../shared/enum/tag-categories.enum';
import { TagsService } from './tags.service';
import { GetCategoryPageByLetterDto } from './types/get-category-page-by-letter.dto';
import { GetCategoryPageDto } from './types/get-category-page.dto';
import { GetCategoryDto } from './types/get-category.dto';
import { GetTagByIdDto } from './types/get-tag-by-id.dto';
import { SearchCategoryDto } from './types/search-category.dto';
import { TagListEntity } from './types/tag-list.entity';

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
  @Get(':id/details')
  async getTagById(@Param() params: GetTagByIdDto): Promise<Tag> {
    return this.tagsService.getTagById(params.id);
  }

  @ApiOperation({
    summary: 'search for a tag by name and optionaly by category',
    description:
      'returns a list sorted depending on the position of the search query in the tag name',
  })
  @ApiBadRequestResponse()
  @Get('search')
  async searchTag(@Query() query: SearchCategoryDto): Promise<Tag[]> {
    return this.tagsService.search(query.q, query.page, query.category);
  }

  @ApiOperation({
    summary: 'get possible values for category',
  })
  @Get('categories')
  getCategories(): string[] {
    return Object.values(CATEGORIES);
  }

  @ApiOperation({
    summary: 'get all existing tags in specified category',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'requested page does not exist' })
  @Get('list/:category')
  async getTagsByCategory(
    @Param() params: GetCategoryDto,
    @Query() query: GetCategoryPageDto,
  ): Promise<TagListEntity> {
    let tags: Tag[];
    const numberOfPages = await this.tagsService.getPageCount(params.category);

    if (query.page > numberOfPages) {
      throw new NotFoundException();
    }

    if (query.popular) {
      tags = await this.tagsService.getTagsByPopularity(
        params.category,
        query.page,
      );
    } else {
      tags = await this.tagsService.getTags(params.category, query.page);
    }

    return {
      data: tags,
      pagination: {
        page: query.page,
        total: numberOfPages,
      },
    };
  }

  @ApiOperation({
    summary:
      'get all existing tags starting by specified letter in specified category',
  })
  @ApiBadRequestResponse()
  @Get('list/:category/:letter')
  async getTagsByCategoryAndLetter(
    @Param() params: GetCategoryPageByLetterDto,
  ): Promise<Tag[]> {
    return this.tagsService.getTagsByLetter(params.category, params.letter);
  }
}
