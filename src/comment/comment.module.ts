import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { CommentSchema,Comment } from './entities/comment.entity';
import { PostService } from 'src/post/post.service';
import { ImageService } from 'src/image/image.service';
import { PostModule } from 'src/post/post.module';
import { ImageModule } from 'src/image/image.module';
import { Image, ImageSchema } from 'src/image/entities/image.entity';
import { Post, PostSchema } from 'src/post/entities/post.entity';

@Module({

  imports: [ 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
            { name: Image.name, schema: ImageSchema },
            { name: Post.name, schema: PostSchema },

      
    ]), PostModule,ImageModule],
  controllers: [CommentController],
  providers: [CommentService, ImageService ,PostService],
})
export class CommentModule {}
