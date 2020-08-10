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
import { TagWithCategory } from '../../common/types/tag-with-category.entity';
import { CategoriesService } from './categories.service';
import { GetCategoryPageByLetterDto } from './types/get-category-page-by-letter.dto';
import { GetCategoryPageDto } from './types/get-category-page.dto';
import { GetCategoryDto } from './types/get-category.dto';
import { TagListEntity } from './types/tag-list.entity';

@ApiTags('tag categories')
@Controller('categories')
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  private readonly CATEGORIES = [
    'tags',
    'artists',
    'characters',
    'parodies',
    'groups',
  ];

  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'get possible values for category',
  })
  @Get()
  categories(): string[] {
    return this.CATEGORIES;
  }

  @ApiOperation({
    summary: 'get all existing tags in specified category',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'requested page does not exist' })
  @Get(':category/tags')
  async tags(
    @Param() params: GetCategoryDto,
    @Query() query: GetCategoryPageDto,
  ): Promise<TagListEntity> {
    let tags: TagWithCategory[];
    const numberOfPages = await this.categoriesService.getPageCount(
      params.category,
    );

    if (query.page > numberOfPages) {
      throw new NotFoundException();
    }

    if (query.popular) {
      tags = await this.categoriesService.getTagsByPopularity(
        params.category,
        query.page,
      );
    } else {
      tags = await this.categoriesService.getTags(params.category, query.page);
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
  @Get(':category/tags/:letter')
  async byLetter(
    @Param() params: GetCategoryPageByLetterDto,
  ): Promise<TagWithCategory[]> {
    return this.categoriesService.getTagsByLetter(
      params.category,
      params.letter,
    );
  }
}
