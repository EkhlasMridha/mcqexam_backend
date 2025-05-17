import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class OAuthCodeDto {
  @ApiProperty({ default: '' })
  @IsString()
  @Expose()
  code: string;
}
