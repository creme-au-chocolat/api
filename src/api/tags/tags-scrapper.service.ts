import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { CATEGORIES } from 'src/shared/enum/tag-categories.enum';
import { HtmlTag } from 'src/shared/types/html-tag.entity';
import { HtmlParserService } from '../../html-parser/html-parser/html-parser.service';
import { getPages } from '../../shared/helpers/get-pagination.helper';
import { parseTags } from '../../shared/helpers/parse-tags.helper';
import { TagDocument } from '../../shared/schemas/tag.schema';

@Injectable()
export class TagsScrapperService {
  private readonly categories = Object.values(CATEGORIES);
  private readonly logger = new Logger(TagsScrapperService.name);

  constructor(
    @InjectModel(TagDocument.name) private tagModel: Model<TagDocument>,
    private htmlParser: HtmlParserService,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  parseAllTags(): void {
    this.categories.forEach(async category => {
      const tags: HtmlTag[] = [];
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
