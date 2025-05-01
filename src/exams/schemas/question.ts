import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';
import { Exam } from './exam';

@Schema()
export class Question extends Document {
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
