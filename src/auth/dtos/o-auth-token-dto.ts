import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OAuthTokenDto {
  @ApiProperty({ default: '' })
  @Expose()
  authToken: string;
}
