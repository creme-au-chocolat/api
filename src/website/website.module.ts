import { CacheModule, Module } from '@nestjs/common';
import { HtmlParserModule } from '../html-parser/html-parser.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { PostPagesController } from './post-pages/post-pages.controller';
import { PostPagesService } from './post-pages/post-pages.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 3600,
    }),
    HtmlParserModule,
  ],
  controllers: [PostPagesController, PostsController, CategoriesController],
  providers: [PostsService, PostPagesService, CategoriesService],
})
export class WebsiteModule {}
