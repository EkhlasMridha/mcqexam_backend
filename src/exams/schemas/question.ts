import { Prop } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';

export class Question extends Document {
  @Prop({
    isRequired: true,
    type: String,
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
    type: Schema.Types.ObjectId,
  })
  exam_id: Schema.Types.ObjectId;

  @Prop({
    isRequired: false,
    type: Number,
  })
  duration?: number;
}
