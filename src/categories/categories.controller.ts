import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TagsResponse, Tag } from './types/tags-response.type';
import { CategoryParam } from './types/category-param.type';
import { PagesResponse } from './types/pages-response.type';
import { TagsParam } from './types/tags-param.type';
import { LetterParam } from './types/letter-param.type';

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

  @Get(':category/pages')
  async pages(@Param() params: CategoryParam): Promise<PagesResponse> {
    const numberOfPages = await this.categoriesService.fetchNumberOfPages(
      `https://nhentai.net/${params.category}/`,
    );

    return {
      pages: numberOfPages,
    };
  }

  @Get(':category/tags')
  async tags(
    @Param() params: CategoryParam,
    @Query() query: TagsParam,
  ): Promise<TagsResponse> {
    const uri = `https://nhentai.net/${params.category}/${
      query.popular ? 'popular' : ''
    }?page=${query.page}`;

    return {
      data: await this.categoriesService.fetchTagsInPage(uri),
      pagination: {
        page: query.page,
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
