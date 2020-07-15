import { Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORIES } from './types/get-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from '../../common/schemas/tag.schema';
import { Model } from 'mongoose';
import { TagWithCategory } from './types/tag-with-category.entity';

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
}
