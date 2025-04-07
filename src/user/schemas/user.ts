import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User extends Document{
    @Prop({
        isRequired:true
    })
     firstName:string;

     @Prop({
        isRequired:true
    })
     lastName:string;

     @Prop({
        isRequired:true
    })
     email:string;

     @Prop({
        isRequired:true
    })
    password:string;

    @Prop({
        isRequired:true,
        type:Number
    })
    permissionLevel:number;
}

export const UserSchema = SchemaFactory.createForClass(User);