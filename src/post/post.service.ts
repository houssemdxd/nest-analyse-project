/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Post } from './entities/post.entity';
import { Injectable } from '@nestjs/common';
import { Image, ImageSchema } from 'src/image/entities/image.entity';

@Injectable()
export class PostService {


  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    @InjectModel(User.name) private readonly UserModel :Model<User>,

  ) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }



  
  async createPost(createPostDto: CreatePostDto) {
    const { title, imageId, subreddit,content,userid } = createPostDto;
  
    // Validate the `imageId`
    /*if (!Types.ObjectId.isValid(imageId)) {
      throw new Error('Invalid imageId');
    }
  
    // Fetch the existing image from the database
    const image = await this.imageModel.findById(imageId);
    if (!image) {
      throw new Error('Image not found');
    }*/
  
    // Create a new post with a reference to the existing image
    const newPost = new this.postModel({
      title,
      upvotes: 0, // Default
      timeAgo: '7h ago', // Hardcoded
      subreddit,
      user: userid, // Replace with actual user ID
      image:imageId,
      //image: image._id, // Reference to the image
      profileImage: 'image1', // Hardcoded
      Content: content, // Example content
    });
  
    // Save the post to the database
    const savedPost = await newPost.save();
  
    // Populate the response to include `username` and `imageName`
    return this.postModel
      .findById(savedPost._id)
      .populate('user', 'username') // Populate the username field from the User schema
      .populate('image', 'imageName'); // Populate the imageName field from the Image schema
  }

  async getAllPosts(userId: string) {
    // Fetch all posts without populating `user` and `image` fields
    const posts = await this.postModel.find();
  
    // Convert `userId` to an ObjectId
    const userObjectId = new Types.ObjectId(userId);
  
    // Map through the posts and manually fetch the `user` and `image` details using their IDs
    const result = await Promise.all(posts.map(async post => {
      // Fetch the user details using the user ID
      const user = await this.UserModel.findById(post.user);
  
      // Fetch the image details using the image ID
      const image = await this.imageModel.findById(post.image);
  
      // Check if the user has upvoted the post
      const statepost = post.upvotedUsers?.includes(userObjectId);
  
      return {
        id: post._id,
        title: post.title,
        upvotes: post.upvotes,
        timeAgo: post.timeAgo,
        subreddit: post.subreddit,
        Content: post.Content,
        author: user ? user.name : null, // Access the 'name' field from the fetched user
        image: image ? image.imageName : null, // Access the 'imageName' field from the fetched image
        profileImage: "image1", // Set the profileImage field to a static value
        statepost: !!statepost, // Convert to a boolean value
      };
    }));
  
    return result;
  }
  






  async updatePostUpvotes(postId: string, userId: string): Promise<any> {
    console.log("this function is called of updates votes")
        if (!Types.ObjectId.isValid(postId)) {
      throw new Error(`Invalid postId: ${postId}`);
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid userId: ${userId}`);
    }
  
    try {
      // Fetch the post
      const post = await this.postModel.findById(postId);

      if (!post) {

        throw new Error(`Post with ID ${postId} not found.`);
      }
          console.log("the userpost id is valid")

      // Check if the user has already upvoted
      const userIndex = post.upvotedUsers.findIndex(
        (user) => user.toString() === userId
      );
  
      if (userIndex === -1) {
        console.log("the user is valid")

        // Add the user to upvotedUsers
        post.upvotedUsers.push(userId as any);
      } else {
        // Remove the user from upvotedUsers (toggle behavior)
        post.upvotedUsers.splice(userIndex, 1);
      }
  
      // Update the upvotes count
      post.upvotes = post.upvotedUsers.length;
  
      // Save the updated post
      const updatedPost = await post.save();
  
      return {
        success: true,
        message: `Post upvotes updated successfully.`,
        post: updatedPost,
      };
    } catch (error) {
      throw new Error(`Failed to update upvotes: ${error.message}`);
    }
  }
  
  



async updatePostUpvotesDesacrement(postId: string) {
  // Validate the `postId`
  if (!Types.ObjectId.isValid(postId)) {
    throw new Error(`Invalid postId: ${postId}`);
  }

  try {
    // Increment the upvotes field by 1
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { upvotes: -1 } }, // Use the `$inc` operator to increment the field
      { new: true } // Return the updated document
    );

    // Check if the post exists
    if (!updatedPost) {
      throw new Error(`Post with ID ${postId} not found.`);
    }

    return {
      success: true,
      message: 'Upvotes incremented successfully',
      post: updatedPost,
    };
  } catch (error) {
    throw new Error(`Failed to increment upvotes for post ${postId}: ${error.message}`);
  }
}

  
  
  }

