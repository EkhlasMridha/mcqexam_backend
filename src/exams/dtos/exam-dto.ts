import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ExamType } from 'src/common/types';

export class ExamDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  @Expose()
  id?: string;

  @IsString()
  @MaxLength(300)
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  title: string;

  @IsNumber()
  @ApiProperty()
  @Expose()
  durationInMinutes?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  examType: ExamType;
}
