import { Type } from 'class-transformer';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class SearchCategoryDto {
  @IsString()
  @MinLength(3)
  q: string;

  category?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page? = 1;
}
