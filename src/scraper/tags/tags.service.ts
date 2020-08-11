import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { HtmlParserService } from '../../html-parser/html-parser/html-parser.service';
import { getPages } from '../../shared/helpers/get-pagination.helper';
import { parseTags } from '../../shared/helpers/parse-tags.helper';
import { Tag } from '../../shared/schemas/tag.schema';
import { Tag as TagEntity } from '../../shared/types/tag.entity';

@Injectable()
export class TagsService {
  private CATEGORIES = ['tags', 'artists', 'characters', 'parodies', 'groups'];
  private readonly logger = new Logger(TagsService.name);

  constructor(
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
    private htmlParser: HtmlParserService,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  parseAllTags(): void {
    this.CATEGORIES.forEach(async category => {
      const tags: TagEntity[] = [];
      const $ = await this.htmlParser.parse(`https://nhentai.net/${category}`);

      const numberOfPages = getPages($, 0);

      for (let i = 1; i <= numberOfPages; i++) {
        const uri = `https://nhentai.net/${category}/?page=${i}`;
        const $page = await this.htmlParser.parse(uri);

        tags.push(...parseTags($page('.tag'), $page));
      }

      tags.forEach(tag => {
        this.tagModel.findOneAndUpdate(
          { name: tag.name },
          { ...tag, category: category },
          {
            upsert: true,
          },
          err => {
            this.logger.error(err);
          },
        );
      });
    });
  }
}
