import { IsEnum } from 'class-validator';

export enum CATEGORIES {
  tags,
  artists,
  characters,
  parodies,
  groups,
}

export class GetCategoryDto {
  @IsEnum(CATEGORIES)
  category: CATEGORIES;
}
