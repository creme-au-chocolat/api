import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetDetailsDto {
  @IsString({ each: true })
  @Transform((filter: string) => filter.toLowerCase())
  filters?: string[] = [];
}
