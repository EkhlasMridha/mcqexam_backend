import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsNotEmpty()
  @ApiProperty({ default: 'john' })
  firstName: string;

  @IsString()
  @MaxLength(250)
  @MinLength(2)
  @IsNotEmpty()
  @ApiProperty({ default: 'doe' })
  lastName: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
    message: 'Weak password',
  })
  @ApiProperty({ default: 'abcd1234#' })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'example@example.com' })
  email: string;
}
