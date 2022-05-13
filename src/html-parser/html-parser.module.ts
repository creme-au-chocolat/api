import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HtmlParserService } from './html-parser/html-parser.service';

@Global()
@Module({
  providers: [HtmlParserService],
  exports: [HtmlParserService],
  imports: [HttpModule],
})
export class HtmlParserModule {}
