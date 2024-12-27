/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {Comment} from 'src/comment/entities/comment.entity' 
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Image } from 'src/image/entities/image.entity';
import { PostService } from 'src/post/post.service';
@Injectable()
export class CommentService {

  constructor(private readonly postService: PostService,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
        @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    

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

  async findAll() {
    return await this.commentModel.find();
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
  



  async getPostsCommentedByUser(userId: string) {
    try {
      // Step 1: Validate the userId
      if (!Types.ObjectId.isValid(userId)) {
        throw new NotFoundException(`Invalid user ID: ${userId}`);
      }
  
      // Step 2: Fetch comments by the specific user
      const comments = await this.commentModel.find({ user: userId });
  
      // Step 3: Extract unique post IDs from the comments
      const postIds = [...new Set(comments.map(comment => comment.post))];
  
      // Step 4: Convert userId to ObjectId for comparison
      const userObjectId = new Types.ObjectId(userId);
  
      // Step 5: Fetch detailed post data for each post ID
      const detailedPosts = await Promise.all(
        postIds.map(async postId => {
          try {
            // Fetch the post by its ID
            const post = await this.postModel.findById(postId);
            if (!post) return null; // Skip if the post does not exist
  
            // Fetch the associated user and image
            const user = await this.userModel.findById(post.user);
            const image = await this.imageModel.findById(post.image);
  
            // Check if the user has upvoted the post
            const statepost = post.upvotedUsers?.includes(userObjectId);
  
            // Calculate the time elapsed since the post was created
            const timeElapsed = this.postService.calculateTimeElapsed(new Date(post.timeAgo));
  
            // Return the enriched post details
            return {
              id: post._id,
              title: post.title,
              upvotes: post.upvotes,
              timeAgo: timeElapsed,
              subreddit: post.subreddit,
              Content: post.Content, // Ensure consistent casing
              author: user ? user.name : null,
              image: image ? image.imageName : null, // Ensure correct image retrieval
              profileImage: 'image1', // Placeholder or static value
              statepost: !!statepost, // Ensure a boolean value
            };
          } catch (error) {
            console.error(`Error fetching details for post ID ${postId}:`, error);
            return null; // Skip this post if an error occurs
          }
        })
      );
  
      // Step 6: Filter out null results (invalid or deleted posts)
      return detailedPosts.filter(post => post !== null);
    } catch (error) {
      console.error('Error fetching posts commented by user:', error);
      throw new Error('Failed to fetch posts commented by user');
    }
  }
  

//trending
  async getThreeMostCommentedPosts() {
    const mostCommentedPosts = await this.commentModel.aggregate([
      {
        $group: {
          _id: '$post', // Group by post ID
          commentCount: { $sum: 1 },
        },
      },
      {
        $sort: { commentCount: -1 }, 
      },
      {
        $limit: 3,
      },
    ]);

    const postIds = mostCommentedPosts.map(post => post._id);

    const posts = await this.postModel.find({ _id: { $in: postIds } });

    const result = posts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.Content,
      commentCount: mostCommentedPosts.find(p => p._id.toString() === post._id.toString()).commentCount,
    }));

    return result;
  }
  async getTrendingPostsWithDetails(userId: string) {
    try {
      // Step 1: Get the three most commented posts
      const mostCommentedPosts = await this.getThreeMostCommentedPosts();
  
      // Step 2: Extract post IDs from the most commented posts
      const postIds = mostCommentedPosts.map(post => post.id);
  
      // Step 3: Convert userId to ObjectId for comparison
      const userObjectId = new Types.ObjectId(userId);
  
      // Step 4: Fetch detailed post data for each post ID
      const detailedPosts = await Promise.all(
        postIds.map(async postId => {
          try {
            // Fetch the post by its ID
            const post = await this.postModel.findById(postId);
            if (!post) return null; // Skip if the post does not exist
  
            // Fetch the associated user and image
            const user = await this.userModel.findById(post.user);
            const image = await this.imageModel.findById(post.image);
  
            // Check if the user has upvoted the post
            const statepost = post.upvotedUsers?.includes(userObjectId);
  
            // Calculate the time elapsed since the post was created
            const timeElapsed = this.postService.calculateTimeElapsed(new Date(post.timeAgo));
  
            // Return the enriched post details
            return {
              id: post._id,
              title: post.title,
              upvotes: post.upvotes,
              timeAgo: timeElapsed,
              subreddit: post.subreddit,
              Content: post.Content, // Ensure consistent casing
              author: user ? user.name : null,
              image: image ? image.imageName : null,
              profileImage: 'image1', // Placeholder or static value
              statepost: !!statepost, // Ensure a boolean value
              commentCount:
                mostCommentedPosts.find(p => p.id === post.id.toString())?.commentCount || 0,
            };
          } catch (error) {
            console.error(`Error fetching details for post ID ${postId}:`, error);
            return null; // Skip this post if an error occurs
          }
        })
      );
  
      // Step 5: Filter out null results (invalid or deleted posts)
      return detailedPosts.filter(post => post !== null);
    } catch (error) {
      console.error('Error fetching trending posts with details:', error);
      throw new Error('Failed to fetch trending posts with details');
    }
  }
  



}
