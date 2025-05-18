import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsNotEmpty()
  @ApiProperty({ default: 'john' })
  @Expose()
  firstName: string;

  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsNotEmpty()
  @ApiProperty({ default: 'doe' })
  @Expose()
  lastName: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Weak password',
  })
  @ApiProperty({ default: 'abcd1234#' })
  @MaxLength(100)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'example@example.com' })
  @Expose()
  email: string;
}
