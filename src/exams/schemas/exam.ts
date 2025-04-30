import { Prop } from '@nestjs/mongoose';
import { ExamType } from 'src/common/types';
import { Document } from 'mongoose';

export class Exam extends Document {
  @Prop({
    isRequired: true,
    type: String,
    maxlength: 300,
  })
  title: string;

  @Prop({
    isRequired: false,
    type: Number,
  })
  durationInMinutes?: number;

  @Prop({
    isRequired: true,
    type: String,
  })
  examType: ExamType;
}
