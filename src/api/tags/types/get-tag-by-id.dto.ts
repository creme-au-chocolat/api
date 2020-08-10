import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class GetTagByIdDto {
  @Type(() => Number)
  @Min(1)
  id: number;
}
