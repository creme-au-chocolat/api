import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseFilterQuery } from 'mongoose';
import { CATEGORIES } from '../../common/enum/tag-categories.enum';
import { Tag } from '../../common/schemas/tag.schema';
import { TagWithCategory } from '../../common/types/tag-with-category.entity';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async getTagById(id: number): Promise<TagWithCategory> {
    const tag = await this.tagModel
      .findOne({ id })
      .select('-__v -_id')
      .exec();

    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }

  async search(
    searchQuery: string,
    category?: string,
  ): Promise<TagWithCategory[]> {
    const nameRegexp = new RegExp(`^.*${searchQuery}.*$`);

    if (category) {
      return await this.tagModel
        .find({ name: nameRegexp, category: category })
        .select('-__v -_id')
        .limit(10);
    } else {
      return await this.tagModel
        .find({ name: nameRegexp })
        .select('-__v -_id')
        .limit(10);
    }
  }
}
