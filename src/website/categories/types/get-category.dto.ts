import { IsEnum } from 'class-validator';

enum CATEGORIES {
  tags,
  artists,
  characters,
  parodies,
  groups,
}

export class GetCategoryDto {
  @IsEnum(CATEGORIES)
  category: string;
}
