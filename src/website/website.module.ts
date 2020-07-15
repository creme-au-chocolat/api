import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from '../common/schemas/tag.schema';
import { HtmlParserModule } from '../html-parser/html-parser.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { PostPagesController } from './post-pages/post-pages.controller';
import { PostPagesService } from './post-pages/post-pages.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 3600,
    }),
    HtmlParserModule,
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
  ],
  controllers: [PostPagesController, PostsController, CategoriesController, TagsController],
  providers: [PostsService, PostPagesService, CategoriesService, TagsService],
})
export class WebsiteModule {}
