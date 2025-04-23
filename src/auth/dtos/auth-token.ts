import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthToken {
  constructor(access: string, refresh: string) {
    this.access_token = access;
    this.refresh_token = refresh;
  }

  @ApiProperty({ default: '' })
  @Expose()
  access_token: string;

  @ApiProperty({ default: '' })
  @Expose()
  refresh_token: string;
}
