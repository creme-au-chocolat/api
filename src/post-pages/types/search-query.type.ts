import { Min, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PopularitySort } from './popularity-sort.enum';

export class SearchQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  q: string;

  @IsEnum(PopularitySort)
  sort: PopularitySort = PopularitySort.none;
}
