import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CATEGORIES } from '../../common/enum/tag-categories.enum';
import { Tag } from '../../common/schemas/tag.schema';
import { TagWithCategory } from '../../common/types/tag-with-category.entity';

@Injectable()
export class TagsService {
  private readonly PAGE_SIZE = 120;

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

  // TODO: add pagination
  // TODO: sort before slicing
  async search(
    searchQuery: string,
    category?: string,
  ): Promise<TagWithCategory[]> {
    const nameRegexp = new RegExp(`^.*${searchQuery}.*$`);

    let tags: TagWithCategory[];

    if (category) {
      tags = await this.tagModel
        .find({ name: nameRegexp, category: category })
        .select('-__v -_id')
        .limit(10);
    } else {
      tags = await this.tagModel
        .find({ name: nameRegexp })
        .select('-__v -_id')
        .limit(10);
    }

    return tags.sort((a, b) => {
      const aName = a.name;
      const bName = b.name;

      return aName.indexOf(searchQuery) - bName.indexOf(searchQuery);
    });
  }

  async getTagsByPopularity(
    category: CATEGORIES,
    page: number,
  ): Promise<TagWithCategory[]> {
    return this.tagModel
      .find({ category: category.toString() })
      .select('-__v -_id')
      .sort({ tagged: 'desc' })
      .skip((page - 1) * this.PAGE_SIZE)
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
      .skip((page - 1) * this.PAGE_SIZE)
      .limit(120)
      .exec();
  }

  async getPageCount(category: CATEGORIES): Promise<number> {
    const modelCount = await this.tagModel
      .countDocuments({ category: category.toString() })
      .exec();

    return Math.ceil(modelCount / this.PAGE_SIZE);
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
