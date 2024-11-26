import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class RefreshToken extends Document {
  @ApiProperty({
    description : 'the token',
    example : 'dbzfhzo53fezhfzedfdedadee'
  })
  @Prop({ required: true })
  token: string;

  @ApiProperty({
    description : 'the id of the user',
    example : 'bdizd5fen23'
  })
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: mongoose.Types.ObjectId;
  @ApiProperty({
    description : 'the expiration date of the token',
    example : '158923'
  })
  @Prop({ required: true })
  expiryDate: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
