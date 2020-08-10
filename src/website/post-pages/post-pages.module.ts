import { CacheModule, Module } from '@nestjs/common';
import { HtmlParserModule } from '../../html-parser/html-parser.module';
import { PostPagesController } from './post-pages.controller';
import { PostPagesService } from './post-pages.service';

@Module({
  imports: [HtmlParserModule, CacheModule.register({ ttl: 3600 })],
  controllers: [PostPagesController],
  providers: [PostPagesService],
})
export class PostPagesModule {}
