import { Transform, Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetCategoryPageDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page? = 1;

  @Transform(({ value }) => value.toLowerCase() !== 'false')
  popular?: boolean;
}
