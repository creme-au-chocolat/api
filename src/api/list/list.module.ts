import { CacheModule, Module } from '@nestjs/common';
import { HtmlParserModule } from '../../html-parser/html-parser.module';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [HtmlParserModule, CacheModule.register({ ttl: 3600 })],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
