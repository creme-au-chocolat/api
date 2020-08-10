import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDetailsDto {
  @IsString()
  @ApiProperty({ description: 'comma separated property list' })
  filters?: string = '';
}
