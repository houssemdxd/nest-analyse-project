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

  async addMessage(userId: string, discussionId: ObjectId, userMessage: string) {
    // Step 1: Find the discussion by userId and discussionId
    const discussion = await this.discussionModel.findOne({
      userId,
      _id: discussionId,
    });
  
    // Step 2: Handle case when discussion is not found
    if (!discussion) {
      throw new Error('Discussion not found');
    }
  
    console.log('Discussion found:', discussion); // Debugging log
  
    // Step 3: Add the user message to the messages array
    discussion.messages.push({ role: 'user', content: userMessage });
  
    // Step 4: Generate an AI response for the user message
    const aiResponse = await this.generateAIResponse(userMessage);
  
    // Step 5: Add the AI response to the messages array
    discussion.messages.push({ role: 'assistant', content: aiResponse });
  
    console.log('Discussion with new messages:', discussion); // Debugging log after adding messages
  
    // Step 6: Update the discussion in the database
    const updatedDiscussion = await this.discussionModel.findByIdAndUpdate(
      discussionId, // The ID of the discussion
      { messages: discussion.messages }, // Update the messages array
      { new: true } // Return the updated document
    );
  
    if (!updatedDiscussion) {
      throw new Error('Failed to update the discussion');
    }
  
    console.log('Updated discussion:', updatedDiscussion); // Debugging log for updated discussion
  
    // Step 7: Return the AI response and updated discussion
    return { aiResponse, discussion: updatedDiscussion };
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
