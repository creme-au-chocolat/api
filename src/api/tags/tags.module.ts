import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from '../../common/schemas/tag.schema';
import { TagsService } from '../../scraper/tags/tags.service';
import { TagsController } from './tags.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    CacheModule.register(),
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
