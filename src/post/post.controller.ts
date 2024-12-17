/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
//create post 
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

//fetchall
  @Post("posts")
  findAll(@Body ("userId") userId: string) {

    console.log("fetching posts from controller ... ");
    return this.postService.getAllPosts(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
//like
  @Post('inc/upvotes')
async incrementUpvotes(@Body('post_id') id: string,@Body('userId') userId: string) {
  console.log("incrementUpvotes ...")
  return this.postService.updatePostUpvotes(id,userId);
}


@Patch(':id/dec/upvotes')
async decrementUpvotes(@Param('id') id: string) {
  return this.postService.updatePostUpvotesDesacrement(id);
}


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
