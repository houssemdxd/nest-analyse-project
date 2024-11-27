import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @ApiProperty({
    description : 'the name of the user',
    example : 'johne'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description : 'the email of the user',
    example : 'johne@gmail.com'
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description : 'the password of the user',
    example : 'Pass*123'
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description : 'the role of the user',
    example : 'Radiologist'
  })
  @Prop({ required: false, type: SchemaTypes.ObjectId })
  roleId: Types.ObjectId;

  @Prop({ default: false })
  isVerfied: Boolean;


}

export const UserSchema = SchemaFactory.createForClass(User);
