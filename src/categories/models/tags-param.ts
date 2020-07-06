import { Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class TagsParam {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Boolean)
  popular = false;
}
