import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PostParam {
  @Type(() => Number)
  @IsInt()
  @Min(100000)
  @Max(999999)
  id: number;
}
