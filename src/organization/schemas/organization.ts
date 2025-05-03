import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Organization extends Document {
  @Prop({
    isRequired: true,
    maxlength: 300,
    type: String,
  })
  organization_name: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
