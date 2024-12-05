/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }


  @Post("posts")
  findAll(@Body ("userId") userId: string) {
    return this.postService.getAllPosts(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Post('inc/upvotes')
async incrementUpvotes(@Body('post_id') id: string,@Body('userId') userId: string) {

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
