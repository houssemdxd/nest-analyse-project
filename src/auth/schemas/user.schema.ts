/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

@Schema()
export class User extends Document {
  @ApiProperty({
    description: 'the name of the user',
    example: 'johne'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'the email of the user',
    example: 'johne@gmail.com'
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'the password of the user',
    example: 'Pass*123'
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'the role of the user',
    example: 'Radiologist'
  })
  // @Prop({ required: false, type: SchemaTypes.ObjectId })
  //roleId: Types.ObjectId;

  @Prop({ required: false, type: SchemaTypes.ObjectId, ref: 'Role' })
  roleId: Role;

  @Prop({ default: false })
  isVerfied: Boolean;

  @Prop({ default: false })
  isBanned: Boolean;

  // Liste des radiologistes associés pour un patient
  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }], default: [] })
  radiologists: Types.ObjectId[];

  // Liste des patients associés pour un radiologiste
  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }], default: [] })
  patients: Types.ObjectId[];


}

export const UserSchema = SchemaFactory.createForClass(User);
