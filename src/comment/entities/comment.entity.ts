/* eslint-disable @typescript-eslint/no-unused-vars */
// src/schemas/discussion.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()

export class Comment {    

@Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
user:Types.ObjectId; // Reference to the User schema 
@Prop({ required: false })
comment: string; // Optional: name of the discussion
@Prop({ type: SchemaTypes.ObjectId, ref: 'Post', required: true })
post: Types.ObjectId; // Reference to the User schema

}

export const CommentSchema = SchemaFactory.createForClass(Comment);

