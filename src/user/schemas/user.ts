import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    isRequired: true,
  })
  firstName: string;

  @Prop({
    isRequired: true,
  })
  lastName: string;

  @Prop({
    isRequired: true,
    unique: true,
  })
  email: string;

  @Prop({
    isRequired: false,
    maxlength: 100,
  })
  password?: string;

  @Prop({
    isRequired: false,
    type: String,
  })
  authProviderIds?: string[];

  @Prop({
    isRequired: true,
    type: Number,
  })
  permissionLevel: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
