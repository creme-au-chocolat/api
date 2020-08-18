import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HtmlParserModule } from 'src/html-parser/html-parser.module';
import { TagDocument, TagSchema } from '../../shared/schemas/tag.schema';
import { TagsScrapperService } from './tags-scrapper.service';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TagDocument.name, schema: TagSchema }]),
    CacheModule.register(),
    HtmlParserModule,
  ],
  controllers: [TagsController],
  providers: [TagsService, TagsScrapperService],
})
export class TagsModule {}
