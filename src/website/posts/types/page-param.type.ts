import { PostParam } from './post-param.type';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PageParam extends PostParam {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
