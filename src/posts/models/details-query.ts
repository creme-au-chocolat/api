import { IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DetailsQuery {
  @IsString({ each: true })
  @Transform((filter: string) => filter.toLowerCase())
  filters: string[] = [];
}
