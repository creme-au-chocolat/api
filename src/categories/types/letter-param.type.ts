import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { CategoryParam } from './category-param.type';

export class LetterParam extends CategoryParam {
  @Length(1, 1)
  @Transform((letter: string) => letter.toUpperCase())
  letter: string;
}
