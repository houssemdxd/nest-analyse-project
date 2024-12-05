import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { CommentSchema,Comment } from './entities/comment.entity';
import { Post, PostSchema } from 'src/post/entities/post.entity';

@Module({

  imports: [ 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
