import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { DiscussionController } from './discussion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from './entities/discussion.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
  ],
  controllers: [DiscussionController],
  providers: [DiscussionService],
})
export class DiscussionModule {}
