import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CATEGORIES } from '../../common/enum/tag-categories.enum';
import { Tag } from '../../common/schemas/tag.schema';
import { TagWithCategory } from '../common/types/tag-with-category.entity';

@Injectable()
export class CategoriesService {
  private readonly pageSize = 120;

  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async getTagsByPopularity(
    category: CATEGORIES,
    page: number,
  ): Promise<TagWithCategory[]> {
    return this.tagModel
      .find({ category: category.toString() })
      .select('-__v -_id')
      .sort({ tagged: 'desc' })
      .skip((page - 1) * this.pageSize)
      .limit(120)
      .exec();
  }

  async getTags(
    category: CATEGORIES,
    page: number,
  ): Promise<TagWithCategory[]> {
    return this.tagModel
      .find({ category: category.toString() })
      .select('-__v -_id')
      .sort({ name: 'asc' })
      .skip((page - 1) * this.pageSize)
      .limit(120)
      .exec();
  }

  async getPageCount(category: CATEGORIES): Promise<number> {
    const modelCount = await this.tagModel
      .countDocuments({ category: category.toString() })
      .exec();

    return Math.ceil(modelCount / this.pageSize);
  }

  async getTagsByLetter(
    category: CATEGORIES,
    letter: string,
  ): Promise<TagWithCategory[]> {
    const nameRegexp = new RegExp(`^${letter}`, 'i');

    return this.tagModel
      .find({
        category: category.toString(),
        name: nameRegexp,
      })
      .select('-__v -_id')
      .sort({ name: 'asc' })
      .exec();
  }
}
