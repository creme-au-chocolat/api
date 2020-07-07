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
import { TagsResponse } from './types/tags-response.type';
import { CategoryParam } from './types/category-param.type';
import { TagsParam } from './types/tags-param.type';
import { LetterParam } from './types/letter-param.type';
import { Tag } from '../common/types/tag.type';

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

  @Get(':category/tags')
  async tags(
    @Param() params: CategoryParam,
    @Query() query: TagsParam,
  ): Promise<TagsResponse> {
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

  @Get(':category/tags/:letter')
  async byLetter(@Param() params: LetterParam): Promise<Tag[]> {
    return this.categoriesService.fetchTagsByLetter(
      params.letter,
      params.category,
    );
  }
}
