import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class OTP extends Document {
  @ApiProperty({
    description : 'the otp code',
    example : '123456'
  })
  @Prop({ required: true })
  otp: string;
  @ApiProperty({
    description : 'the id of the user',
    example : 'debh5avdhcz23'
  })
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @ApiProperty({
    description : 'the expiration date of the otp',
    example : '12315'
  })
  @Prop({ required: true })
  expiryDate: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
