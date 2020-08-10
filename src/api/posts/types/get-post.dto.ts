import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999999)
  id: number;
}
