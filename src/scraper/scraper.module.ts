import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { HtmlParserModule } from '../html-parser/html-parser.module';
import { Tag, TagSchema } from '../shared/schemas/tag.schema';
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
