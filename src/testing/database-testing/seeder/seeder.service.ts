import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { internet, lorem, random } from 'faker';
import { Model } from 'mongoose';
import { Tag } from 'src/shared/types/tag.entity';
import { TagDocument } from '../../../shared/schemas/tag.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(TagDocument.name) private tagModel: Model<TagDocument>,
  ) {}

  public async seedTags(): Promise<[TagDocument[], Tag[]]> {
    const tags: Tag[] = [];

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
