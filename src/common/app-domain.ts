import { Prop } from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';
import { Organization } from 'src/organization/schemas/organization';
import { User } from 'src/user/schemas/user';

export class AppDomain extends Document {
  @Prop({
    isRequired: false,
    type: Schema.Types.ObjectId,
    ref: User.name,
  })
  created_by?: Schema.Types.ObjectId;

  @Prop({
    isRequired: false,
    type: Schema.Types.ObjectId,
    ref: User.name,
  })
  updated_by?: Schema.Types.ObjectId;

  @Prop({
    isRequired: false,
    type: String,
  })
  created_at?: string;

  @Prop({
    isRequired: false,
    type: String,
  })
  updated_at?: string;

  @Prop({
    isRequired: false,
    type: Schema.Types.ObjectId,
    ref: Organization.name,
  })
  organization_id?: Schema.Types.ObjectId;
}
