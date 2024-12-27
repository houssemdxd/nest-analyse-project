import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  //create cmnt
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }
  //get cmnt by post
  @Post("getcommentforpost")
  getAllCommentForApost(@Body("post_id") post_id:string ) {
    return this.commentService.getCommentsByPostId(post_id);
  }

  @Post('posts/commented-by-user')
  async getPostsCommentedByUser(@Body('userId') userId: string) {
    return this.commentService.getPostsCommentedByUser(userId);
  }


  @Post('most-commented-posts')
  async getThreeMostCommentedPosts() {
    return this.commentService.getThreeMostCommentedPosts();
  }

  @Post('trending')
  async findTrendingPosts(@Body('userId') userId: string) {
    console.log('Fetching trending posts from controller...');
    try {
      return await this.commentService.getTrendingPostsWithDetails(userId);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      throw new Error('Failed to fetch trending posts');
    }
  }
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
