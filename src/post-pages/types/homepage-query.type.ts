import { Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class HomepageQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
}
