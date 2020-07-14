import { IsString } from 'class-validator';

export class GetDetailsDto {
  @IsString()
  filters?: string = '';
}
