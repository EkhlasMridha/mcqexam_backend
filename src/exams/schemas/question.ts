import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType } from 'mongoose';
import { AppDomain } from 'src/common/app-domain';
import { Exam } from './exam';

@Schema()
export class Question extends AppDomain {
  @Prop({
    isRequired: true,
    type: String,
    maxlength: 700,
  })
  question: string;

  @Prop({
    isRequired: true,
    type: Array<Number>,
  })
  options: number[];

  @Prop({
    isRequired: true,
    type: Number,
  })
  answer: number;

  @Prop({
    isRequired: true,
    type: SchemaType.Types.ObjectId,
    ref: Exam.name,
  })
  exam_id: SchemaType.Types.ObjectId;

  @Prop({
    isRequired: false,
    type: Number,
    max: 7200,
  })
  durationInSeconds?: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
