import { Controller, Get, Param } from '@nestjs/common';
import { CategoryParam } from './models/category-param';
import { CategoriesService } from './categories.service';
import { PagesResponse } from './models/pages-response';

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
}
