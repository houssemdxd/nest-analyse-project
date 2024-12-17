// src/discussion/discussion.controller.ts
import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { ObjectId } from 'mongoose';

@Controller('chat')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  // Create a new discussion with an initial message and get assistant's response
  @Post(':userId/new')
  async createDiscussion(
    @Param('userId') userId: string,
    @Body('message') initialMessage: string,
  ) {
    console.log("___________________________________________---______" + " : "+ userId);
    var res = await this.discussionService.createDiscussion(userId, initialMessage);
    console.log(res.title);
    return res;
  }

  // Send a message in an existing discussion and get the assistant's response
  @Post(':userId/:discussionId')
  async addMessage(
    @Param('userId') userId: string,
    @Param('discussionId') discussionId: ObjectId,
    @Body('message') userMessage: string,
  ) {
    return this.discussionService.addMessage(userId, discussionId, userMessage);
  }


  @Get(':userId/:discussionId')
  async getDiscussion(
    @Param('userId') userId: string,
    @Param('discussionId') discussionId: ObjectId,
  ) {
    return this.discussionService.getDiscussion(userId, discussionId);
  }

  @Get(':userId')
  async getAllDiscussions(@Param('userId') userId: string) {
    console.log("in get all discussions now");
    return this.discussionService.getAllDiscussions(userId);
  } 
}
