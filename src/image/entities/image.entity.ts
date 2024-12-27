// src/schemas/discussion.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()
export class Image extends Document {


  @Prop({ required: true })
  title: string; // Optional: name of the discussion

  @Prop({ required: false })
  imageName: string; // Optional: name of the discussion

  
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // Reference to the User schema


  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  patient: Types.ObjectId; // Patient associated with the image

}

export const ImageSchema = SchemaFactory.createForClass(Image);
