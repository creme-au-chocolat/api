import { IsEnum } from 'class-validator';

enum CATEGORIES {
  tags,
  artists,
  characters,
  parodies,
  groups,
}

export class CategoryParam {
  @IsEnum(CATEGORIES)
  category: string;
}
