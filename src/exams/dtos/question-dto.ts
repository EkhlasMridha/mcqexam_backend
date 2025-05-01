import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class QuestionDto {
  @IsString()
  @ApiProperty()
  @Expose()
  id?: string;

  @IsString()
  @MaxLength(700)
  @ApiProperty()
  @Expose()
  question: string;

  @IsArray()
  @IsNumber()
  @MaxLength(10)
  @ApiProperty()
  @Expose()
  options: number[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  @Max(10)
  answer: number;

  @IsNumber()
  @IsOptional()
  @Max(7200)
  @ApiProperty()
  @Expose()
  durationInSeconds?: number;
}
