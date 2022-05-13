import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class SearchRandomPostDto {
  @IsString()
  q: string;

  @ApiProperty({
    description: 'redirect to nhentai page instead of getting api response',
  })
  @Transform(({ value }) => value !== '0' && value.toLowerCase() !== 'false')
  redirect?: boolean = false;
}
