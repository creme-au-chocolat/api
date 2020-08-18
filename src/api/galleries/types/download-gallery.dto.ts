import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class DownloadGalleryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numberOfPages? = 10000;
}
