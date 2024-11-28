import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Discussion } from './entities/discussion.entity';

@Injectable()
export class DiscussionService {
  private genAI = new GoogleGenerativeAI(process.env.API_KEY);
  private model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<Discussion>,
  ) {}

  // Create a new discussion and immediately send a message to receive a response
  async createDiscussion(userId: string, initialMessage: string) {
    // Generate the title for the discussion based on the first message
    const title = await this.generateDiscussionTitle(initialMessage);

    // Generate AI response to the first message
    const aiResponse = await this.generateAIResponse(initialMessage);

    // Create the discussion object with the user's message and AI response
    const newDiscussion = new this.discussionModel({
      userId,
      title,
      messages: [
        { role: 'user', content: initialMessage },
        { role: 'assistant', content: aiResponse },
      ],
    });

    // Save and return the discussion
    return newDiscussion.save();
  }

  // Send a new message in an existing discussion and get a response from the AI
  async addMessage(
    userId: string,
    discussionId: ObjectId,
    userMessage: string,
  ) {
    const discussion = await this.discussionModel.findOne({
      userId,
      _id: discussionId,
    });

    if (!discussion) throw new Error('Discussion not found');

    // Add user message
    discussion.messages.push({ role: 'user', content: userMessage });

    // Generate AI response for the new message
    const aiResponse = await this.generateAIResponse(userMessage);
    discussion.messages.push({ role: 'assistant', content: aiResponse });

    await discussion.save();

    return { aiResponse, discussion };
  }

  async getDiscussion(userId: string, discussionId: ObjectId) {
    const discussion = await this.discussionModel.findOne({
      userId,
      _id: discussionId,
    });

    if (!discussion) throw new Error('Discussion not found');

    return discussion;
  }


  async getAllDiscussions(userId: string) {
    return this.discussionModel.find({ userId }).select('title createdAt');
  }

  // Generate a discussion title based on the initial message
  private async generateDiscussionTitle(context: string) {
    const prompt = `Generate a short, descriptive title for this message: "${context}"`;
    const result = await this.model.generateContent(prompt);
    return result.response.text().trim();
  }

  // Generate an AI response for a given message
  private async generateAIResponse(userMessage: string) {
    const result = await this.model.generateContent(userMessage);
    return result.response.text();
  }
}
