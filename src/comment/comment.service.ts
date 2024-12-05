/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {Comment} from 'src/comment/entities/comment.entity' 
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class CommentService {

  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,

  ) {}

  async createComment(createComment: CreateCommentDto) {
    console.log("the ffunction of crate comment is called ")
   
    // Validate ObjectId for `user` and `image`
    if (!Types.ObjectId.isValid(createComment.user)) {
      throw new NotFoundException(`Invalid user ID: ${createComment.user}`);
    }
    if (!Types.ObjectId.isValid(createComment.post)) {
      throw new NotFoundException(`Invalid post ID: ${createComment.post}`);
    }
  
    try {
      // Create and save the comment
      const newComment = new this.commentModel({
        user: createComment.user,
        post: createComment.post,
        comment: createComment.comment || '', // Use an empty string if `comment` is not provided
      });
  
      return await newComment.save();
    } catch (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  }
  
  /*create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }*/

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }





  async getCommentsByPostId(postId: string) {
    // Validate the `postId`
    if (!Types.ObjectId.isValid(postId)) {
      throw new Error(`Invalid post ID: ${postId}`);
    }
  
    // Fetch the comments for the given post ID
    const comments = await this.commentModel.find({ post: postId });
  
    // Map over the comments to fetch the associated user details
    const result = await Promise.all(
      comments.map(async (comment) => {
        // Fetch the user details using the user ID
        const user = await this.userModel.findById(comment.user);
  
        return {
          username: user ? user.name : 'Anonymous', // Default to 'Anonymous' if user is not found
          comment: comment.comment,
          profileimage: 'image1', // Static profile image
        };
      }),
    );
  
    return result;
  }
  
















}
