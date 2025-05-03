import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AppDomain } from 'src/common/app-domain';
import { ExamType } from 'src/common/types';

@Schema()
export class Exam extends AppDomain {
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

export const ExamSchema = SchemaFactory.createForClass(Exam);
