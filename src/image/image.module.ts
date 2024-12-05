import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Image, ImageSchema } from './entities/image.entity';

@Module({
  imports: [ 
  MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Image.name, schema: ImageSchema },


  ]),],

  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
