import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from 'src/shared/types/tag.entity';
import { CATEGORIES } from '../../shared/enum/tag-categories.enum';
import { TagDocument } from '../../shared/schemas/tag.schema';

@Injectable()
export class TagsService {
  static PAGE_SIZE = 40;

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

  async search(
    searchQuery: string,
    startPage: number,
    category?: string,
  ): Promise<Tag[]> {
    const nameRegexp = new RegExp(`^.*${searchQuery}.*$`);

    let tags: Tag[] = [];
    let filter = {};

    if (category) {
      filter = {
        name: nameRegexp,
        category: category,
      };
    } else {
      filter = {
        name: nameRegexp,
      };
    }

    tags = await this.tagModel.find(filter).select('-__v -_id');

    return tags
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => {
        const aName = a.name;
        const bName = b.name;

        return aName.indexOf(searchQuery) - bName.indexOf(searchQuery);
      })
      .slice(
        (startPage - 1) * TagsService.PAGE_SIZE,
        startPage * TagsService.PAGE_SIZE,
      );
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
      .sort({ name: 'asc', id: 'asc' })
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
