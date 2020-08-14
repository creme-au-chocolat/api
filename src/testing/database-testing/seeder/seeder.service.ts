import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from 'src/shared/types/tag.entity';
import { generateRandomTags } from 'test/mocks/tags.mock';
import { TagDocument } from '../../../shared/schemas/tag.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(TagDocument.name) private tagModel: Model<TagDocument>,
  ) {}

  public async seedTags(): Promise<[TagDocument[], Tag[]]> {
    const tags = generateRandomTags(100);

    return [await this.tagModel.create(tags), tags];
  }
}
