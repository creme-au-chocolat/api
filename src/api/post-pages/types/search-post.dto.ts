import { Min, IsInt, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PopularitySortOptions } from './popularity-sort-options.enum';

export class SearchPostDto {
  @IsString()
  q: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page? = 1;

  @IsEnum(PopularitySortOptions)
  sort: PopularitySortOptions = PopularitySortOptions.none;
}
