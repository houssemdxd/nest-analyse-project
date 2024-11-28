// src/schemas/discussion.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Discussion extends Document {
  @Prop({ required: true })
  userId: string; // Links discussion to a specific user

  @Prop({ required: true })
  title: string; // Optional: name of the discussion

 
  @Prop({ type: Array })
  messages: { role: string; content: string }[]; // History of messages
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
