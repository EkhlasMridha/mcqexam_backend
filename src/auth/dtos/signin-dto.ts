import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'example@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'abcd1234#' })
  password: string;
}
