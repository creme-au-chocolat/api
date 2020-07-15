import { IsEnum } from 'class-validator';
import { CATEGORIES } from '../../../common/enum/tag-categories.enum';

export class GetCategoryDto {
  @IsEnum(CATEGORIES)
  category: CATEGORIES;
}
