import { CacheModule, Module } from '@nestjs/common';
import { HtmlParserModule } from '../../html-parser/html-parser.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [HtmlParserModule, CacheModule.register({ ttl: 3600 })],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
