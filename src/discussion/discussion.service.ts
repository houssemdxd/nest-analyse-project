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
  a/*sync createDiscussion(userId: string, initialMessage: string) {
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
  }*/
    async createDiscussion(userId: string, initialMessage: string) {


        if (!initialMessage ){
          initialMessage = "hello"
        }
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
  
      // Save the new discussion
      const savedDiscussion = await newDiscussion.save();
  
      // Return the discussion object with aiResponse included
      return {
          id: savedDiscussion._id,
          aiResponse, // Return aiResponse alongside other discussion details
          title: savedDiscussion.title,
      };
  }
/*
  async addMessage(userId: string, discussionId: ObjectId, userMessage: string) {
    console.log('Start addMessage function');
    console.log('Received Params:', { userId, discussionId });
    console.log('Received User Message:', userMessage);
  
    // Generate AI response
    const aiResponse = await this.generateAIResponse(userMessage);
    console.log('Generated AI Response:', aiResponse);
  
    // Update the discussion in the database
    const updatedDiscussion = await this.discussionModel.findByIdAndUpdate(
      discussionId,
      {
        $push: {
          messages: [
            { role: 'user', content: userMessage },
            { role: 'assistant', content: aiResponse },
          ],
        },
      },
      { new: true } // Return the updated document
    );
  
    if (!updatedDiscussion) {
      console.error(`Discussion not found for userId: ${userId}, discussionId: ${discussionId}`);
      throw new Error('Discussion not found');
    }
  
    console.log('Updated Discussion:', updatedDiscussion);
    return { aiResponse, updatedDiscussion };
  }
  */
   // Add a message to the discussion and generate a response
   async addMessage(userId: string, discussionId: ObjectId, userMessage: string) {
    // Fetch the discussion from the database to get the full conversation
    const discussion = await this.discussionModel.findById(discussionId);

    if (!discussion) {
        console.error(`Discussion not found for userId: ${userId}, discussionId: ${discussionId}`);
        throw new Error('Discussion not found');
    }

    // Push the new user message to the conversation history
    const newMessages = [...discussion.messages, { role: 'user', content: userMessage }];

    // Generate the AI response using the entire conversation history
    const aiResponse = await this.generateAIResponse(newMessages.map(msg => msg.content).join('\n'));

    // Add the AI response to the messages
    newMessages.push({ role: 'assistant', content: aiResponse });

    // Update the discussion with the new messages
    const updatedDiscussion = await this.discussionModel.findByIdAndUpdate(
        discussionId,
        { messages: newMessages },
        { new: true } // Return the updated document
    );

    if (!updatedDiscussion) {
        console.error(`Failed to update discussion with ID: ${discussionId}`);
        throw new Error('Failed to update discussion');
    }

    // Return the response formatted as expected by the client
    return {
        id: updatedDiscussion._id,
        title: updatedDiscussion.title,
        aiResponse: aiResponse,
    };
}

  
  async getDiscussion(userId: string, discussionId: ObjectId) {
    console.log('Fetching Discussion');
    console.log('User ID:', userId);
    console.log('Discussion ID:', discussionId);
  
    try {
      // Fetch the discussion from the database
      const discussion = await this.discussionModel.findOne({
        userId,
        _id: discussionId,
      });
  
      if (!discussion) {
        console.error('Discussion not found for the given IDs');
        throw new Error('Discussion not found');
      }
  
      // Log the complete discussion object
      console.log('Fetched Discussion:', discussion);
  
      // Log each message in the discussion
      console.log('Messages in Discussion:');
      discussion.messages.forEach((msg, index) => {
        console.log(`Message ${index + 1}:`, msg);
      });
  
      return discussion;
    } catch (error) {
      console.error('Error fetching discussion:', error.message);
      throw error;
    }
  }

  async getAllDiscussions(userId: string) {
    return this.discussionModel.find({ userId }).select('title createdAt');
  }

  // Generate a discussion title based on the initial message
  private async generateDiscussionTitle(context: string) {
    const prompt = `Generate a short, descriptive title for this message 4 words maximum: "${context}"`;
    const result = await this.model.generateContent(prompt);
    return result.response.text().trim();
  }

  // Generate an AI response for a given message
  private async generateAIResponse(userMessage: string) {
    const result = await this.model.generateContent(userMessage);
    return result.response.text();
  }
}
