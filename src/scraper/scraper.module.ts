import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Tag, TagSchema } from '../common/schemas/tag.schema';
import { HtmlParserModule } from '../html-parser/html-parser.module';
import { TagsService } from './tags/tags.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    HtmlParserModule,
  ],
  providers: [TagsService],
})
export class ScraperModule {}
