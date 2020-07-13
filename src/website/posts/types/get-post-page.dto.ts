import { GetPostDto } from './get-post.dto';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GetPostPageDto extends GetPostDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}
