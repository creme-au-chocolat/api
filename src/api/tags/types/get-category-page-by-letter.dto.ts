import { Transform } from 'class-transformer';
import { Length } from 'class-validator';
import { GetCategoryDto } from './get-category.dto';

export class GetCategoryPageByLetterDto extends GetCategoryDto {
  @Length(1, 1)
  @Transform(({ value: letter }) => letter.toUpperCase())
  letter: string;
}
