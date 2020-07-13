import { Min, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class GetCategoryPageDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page? = 1;

  @Transform(
    (value: string) => value !== '0' && value.toLowerCase() !== 'false',
  )
  popular? = false;
}
