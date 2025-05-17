import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class OAuthTokenDto {
  @ApiProperty({ default: '' })
  @IsString()
  @Expose()
  authToken: string;
}
