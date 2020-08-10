import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PostPagesModule } from './post-pages/post-pages.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [CategoriesModule, TagsModule, PostsModule, PostPagesModule],
  controllers: [],
  providers: [],
})
export class WebsiteModule {}
