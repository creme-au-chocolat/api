import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { GetCategoryDto } from './get-category.dto';

export class GetCategoryPageByLetterDto extends GetCategoryDto {
  @Length(1, 1)
  @Transform((letter: string) => letter.toUpperCase())
  letter: string;
}
