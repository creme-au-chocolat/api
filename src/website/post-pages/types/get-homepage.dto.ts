import { Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetHomepageDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
}
