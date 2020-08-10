import { IsString, MinLength } from 'class-validator';

export class SearchCategoryDto {
  @IsString()
  @MinLength(3)
  q: string;

  category?: string;
}
