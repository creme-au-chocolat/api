import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TagsService } from './tags/tags.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TagsService],
})
export class ScraperModule {}
