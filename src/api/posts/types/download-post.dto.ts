import { Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DownloadPostDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numberOfPages? = 10000;
}
