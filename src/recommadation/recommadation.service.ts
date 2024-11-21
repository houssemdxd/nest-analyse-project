import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Recommadation } from './entities/recommadation.entity';
import { User } from '../auth/schemas/user.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RecommadationService {
  private genAI: any;

  constructor(
    @InjectModel(Recommadation.name) private readonly recommadationModel: Model<Recommadation>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY is missing. Please set it in your environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  // Generate content using Google Generative AI
  async generateContent(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return await result.response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content.');
    }
  }

  // Create a recommendation for a specific user
  async createRecommadation(userId: string, title: string, content: string): Promise<Recommadation> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recommendation = new this.recommadationModel({
      title,
      content,
      user: user._id,
    });

    return recommendation.save();
  }

  // Fetch all recommendations for a specific user
  async getRecommadationsByUser(userId: string): Promise<Recommadation[]> {
    console.log("the user id provided by the app is "+ userId)
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.recommadationModel.find({ user: user._id });
  }

  // Fetch a specific recommendation by ID
  async getRecommadationById(recommendationId: string): Promise<Recommadation> {
    const recommendation = await this.recommadationModel.findById(recommendationId);
    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }
    return recommendation;
  }

  // Update a recommendation by ID
  async updateRecommadation(recommendationId: string, updates: Partial<Recommadation>): Promise<Recommadation> {
    const recommendation = await this.recommadationModel.findByIdAndUpdate(recommendationId, updates, {
      new: true,
    });
    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }
    return recommendation;
  }

  // Delete a recommendation by ID
  async deleteRecommadation(recommendationId: string): Promise<{ message: string }> {
    const result = await this.recommadationModel.findByIdAndDelete(recommendationId);
    if (!result) {
      throw new NotFoundException('Recommendation not found');
    }
    return { message: 'Recommendation successfully deleted' };
  }

  async generateRecommendationForAllUsers(): Promise<any> {
  try {
    // Step 1: Fetch all users
    console.log('Fetching all users...');
    const users: User[] = await this.userModel.find();
    console.log(`Found ${users.length} users.`);

    // Step 2: Iterate through each user and generate a recommendation
    const recommendations = [];
    for (const user of users) {
      try {
        console.log(`Generating recommendation for user: ${user.name} (ID: ${user._id})`);
        const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

        // Add delay before making the request to the API (e.g., 2 seconds)
        await sleep(2000);  // Adjust this delay as needed

        // Generate a personalized prompt for each user (you can customize this prompt)
        const prompt = `Generate arecommendation for user that contain only 5 words: ${user.name}`;
        const content = await this.generateContent(prompt);

        // Save the generated recommendation in the database
        await this.saveRecommendation(user.id, content);

        recommendations.push({
          userId: user._id,
          recommendation: content,
        });

        console.log(`Recommendation for user ${user.name} generated successfully.`);
      } catch (error) {
        console.error(`Error generating recommendation for user ${user.name}:`, error);
      }
    }

    return {
      statusCode: 200,
      message: 'Recommendations generated successfully for all users.',
      data: recommendations, // Optionally return the generated recommendations
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations.');
  }
}

  // Save the generated recommendation in your database
  async saveRecommendation(userId: string, recommendationContent: string): Promise<void> {
    try {
      console.log(`Saving recommendation for user ${userId}...`);
      const recommendation = new this.recommadationModel({
        user: userId,
        content: recommendationContent,
        title: 'Generated Recommendation', // You can customize the title as needed
      });

      await recommendation.save();
      console.log(`Saved recommendation for user ${userId}: ${recommendationContent}`);
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw new Error('Failed to save recommendation.');
    }
  }



  @Cron('*/5 * * * *')
  async generateRecommendationsJob(): Promise<void> {
    console.log('Running scheduled job: Generating recommendations for all users...');
    try {
      const result = await this.generateRecommendationForAllUsers();
      console.log('Job completed successfully:', result.message);
    } catch (error) {
      console.error('Error during scheduled recommendation generation:', error.message);
    }
  }


}



