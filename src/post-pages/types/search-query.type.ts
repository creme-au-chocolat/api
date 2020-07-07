import { Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { Query } from './query.type';

export class SearchQuery extends Query {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
}
