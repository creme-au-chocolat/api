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
import { Tag } from '../common/types/tag.entity';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
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

  @Get()
  categories(): string[] {
    return this.CATEGORIES;
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'requested page does not exist' })
  @Get(':category/tags')
  async tags(
    @Param() params: GetCategoryDto,
    @Query() query: GetCategoryPageDto,
  ): Promise<TagListEntity> {
    const uri = `https://nhentai.net/${params.category}/${
      query.popular ? 'popular' : ''
    }?page=${query.page}`;

    const [tags, pages] = await this.categoriesService.fetchTagsInPage(
      uri,
      query.page,
    );

    if (query.page > pages) {
      throw new NotFoundException();
    }

    return {
      data: tags,
      pagination: {
        page: query.page,
        total: pages,
      },
    };
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse({ description: 'no tags with requested letter' })
  @Get(':category/tags/:letter')
  async byLetter(@Param() params: GetCategoryPageByLetterDto): Promise<Tag[]> {
    return this.categoriesService.fetchTagsByLetter(
      params.letter,
      params.category,
    );
  }
}
