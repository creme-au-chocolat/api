import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { internet, lorem, random } from 'faker';
import { Model } from 'mongoose';
import { Tag } from '../../../shared/schemas/tag.schema';
import { TagWithCategory } from '../../../shared/types/tag-with-category.entity';

@Injectable()
export class SeederService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  public async seedTags(): Promise<[Tag[], TagWithCategory[]]> {
    const tags: TagWithCategory[] = [];

    for (let i = 0; i < 1000; i++) {
      const tag = {
        name: lorem.word(),
        tagged: random.number(),
        uri: internet.url(),
        id: random.number(999999),
        category: random.arrayElement([
          'tags',
          'artists',
          'characters',
          'parodies',
          'groups',
        ]),
      };

      tags.push(tag);
    }

    return [await this.tagModel.create(tags), tags];
  }
}
