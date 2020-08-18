import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetGalleryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999999)
  id: number;
}
