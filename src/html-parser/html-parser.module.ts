import { Module, Global } from '@nestjs/common';
import { HtmlParserService } from './html-parser/html-parser.service';

@Global()
@Module({
  providers: [HtmlParserService],
  exports: [HtmlParserService],
})
export class HtmlParserModule {}
