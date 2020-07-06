import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HtmlParserModule } from './html-parser/html-parser.module';

@Module({
  imports: [HtmlParserModule],
  providers: [AppService],
})
export class AppModule {}
