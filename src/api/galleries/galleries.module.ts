import { CacheModule, Module } from '@nestjs/common';
import { HtmlParserModule } from '../../html-parser/html-parser.module';
import { GalleriesController } from './galleries.controller';
import { GalleriesService } from './galleries.service';

@Module({
  imports: [HtmlParserModule, CacheModule.register({ ttl: 3600 })],
  controllers: [GalleriesController],
  providers: [GalleriesService],
})
export class GalleriesModule {}
