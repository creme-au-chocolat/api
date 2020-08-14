import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from 'src/shared/types/tag.entity';
import { CATEGORIES } from '../../shared/enum/tag-categories.enum';
import { TagDocument } from '../../shared/schemas/tag.schema';

@Injectable()
export class TagsService {
  static PAGE_SIZE = 120;

  constructor(
    @InjectModel(TagDocument.name) private tagModel: Model<TagDocument>,
  ) {}

  async getTagById(id: number): Promise<Tag> {
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
  async search(searchQuery: string, category?: string): Promise<Tag[]> {
    const nameRegexp = new RegExp(`^.*${searchQuery}.*$`);

    let tags: Tag[];

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
  ): Promise<Tag[]> {
    return this.tagModel
      .find({ category: category.toString() })
      .select('-__v -_id')
      .sort({ tagged: 'desc' })
      .skip((page - 1) * TagsService.PAGE_SIZE)
      .limit(120)
      .exec();
  }

  async getTags(category: CATEGORIES, page: number): Promise<Tag[]> {
    return this.tagModel
      .find({ category: category.toString() })
      .select('-__v -_id')
      .sort({ name: 'asc' })
      .skip((page - 1) * TagsService.PAGE_SIZE)
      .limit(120)
      .exec();
  }

  async getPageCount(category: CATEGORIES): Promise<number> {
    const modelCount = await this.tagModel
      .countDocuments({ category: category.toString() })
      .exec();

    return Math.ceil(modelCount / TagsService.PAGE_SIZE);
  }

  async getTagsByLetter(category: CATEGORIES, letter: string): Promise<Tag[]> {
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
