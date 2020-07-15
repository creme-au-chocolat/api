import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  CacheInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TagListEntity } from './types/tag-list.entity';
import { GetCategoryDto } from './types/get-category.dto';
import { GetCategoryPageDto } from './types/get-category-page.dto';
import { GetCategoryPageByLetterDto } from './types/get-category-page-by-letter.dto';
import { Tag } from '../../common/types/tag.entity';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('tags')
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
    let tags: Tag[];
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
  @ApiNotFoundResponse({ description: 'no tags with requested letter' })
  @Get(':category/tags/:letter')
  async byLetter(@Param() params: GetCategoryPageByLetterDto): Promise<Tag[]> {
    return this.categoriesService.getTagsByLetter(
      params.category,
      params.letter,
    );
  }
}
