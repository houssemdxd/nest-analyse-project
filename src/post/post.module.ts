import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { ImageSchema ,Image} from 'src/image/entities/image.entity';
import { Post, PostSchema } from './entities/post.entity';

@Module({

  imports: [ 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Image.name, schema: ImageSchema },
      { name: Post.name, schema: PostSchema },

  
    ]),],

  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
