import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ default: '' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  refreshToken: string;
}
