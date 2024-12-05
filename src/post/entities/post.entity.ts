/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/schemas/discussion.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()
export class Post {

    @Prop({ required: true })
    title: string; // Optional: name of the discussion
    @Prop({ required: false })
    upvotes: Number
    @Prop({ required: false })
    timeAgo: string
    @Prop({ required: false })
    subreddit: string
    @Prop({ required: false })
    Content: string
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
    user:Types.ObjectId; // Reference to the User schema
    @Prop({ type: SchemaTypes.ObjectId, ref: 'Image', required: true })
    image: Types.ObjectId; // Reference to the User schema
    @Prop({ type: [SchemaTypes.ObjectId], ref: 'User', default: [] })
    upvotedUsers: Types.ObjectId[]; // Array of references to User schema
   


}
export const PostSchema = SchemaFactory.createForClass(Post);
