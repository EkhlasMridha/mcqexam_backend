import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
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
  })
  email: string;

  @Prop({
    isRequired: true,
  })
  @Exclude()
  password: string;

  @Prop({
    isRequired: true,
    type: Number,
  })
  permissionLevel: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
