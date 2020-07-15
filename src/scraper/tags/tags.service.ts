import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from '../../common/schemas/tag.schema';
import { Tag as TagEntity } from '../../common/types/tag.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getPages } from '../../common/helpers/get-pagination.helper';
import { HtmlParserService } from '../../html-parser/html-parser/html-parser.service';
import { parseTags } from '../../common/helpers/parse-tags.helper';

@Injectable()
export class TagsService {
  private CATEGORIES = ['tags', 'artists', 'characters', 'parodies', 'groups'];
  private readonly logger = new Logger(TagsService.name);

  constructor(
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
    private htmlParser: HtmlParserService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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
