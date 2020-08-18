import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { GetGalleryDto } from './get-gallery.dto';

export class GetGalleryPageDto extends GetGalleryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
