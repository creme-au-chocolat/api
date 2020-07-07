import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HtmlParserModule } from './html-parser/html-parser.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';

@Module({
  imports: [HtmlParserModule, CacheModule.register({ ttl: 3600 })],
  controllers: [AppController, CategoriesController, PostsController],
  providers: [AppService, CategoriesService, PostsService],
})
export class AppModule {}
