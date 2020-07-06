import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryParam } from './models/category-param';
import { CategoriesService } from './categories.service';
import { PagesResponse } from './models/pages-response';
import { TagsParam } from './models/tags-param';
import { TagsResponse } from './models/tags-response';

@Controller('categories')
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
}
