/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Recommadation } from './entities/recommadation.entity';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Cron } from '@nestjs/schedule';
interface OcrData {
  userId: string;
  [key: string]: any; // To handle unknown dynamic attributes
}
@Injectable()
export class RecommadationService {
  private genAI: any;

  constructor(
    @InjectModel(Recommadation.name) private readonly recommadationModel: Model<Recommadation>,
    @InjectModel(User.name) private readonly userModel: Model<User>,

    @InjectModel('OCRData') private readonly ocrDataModel: Model<OcrData>, // Inject OCRDataModel


  ) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY is missing. Please set it in your environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }



  // Extract JSON from a string
  extractJson(input: string): object | null {
    try {
      const startIndex = input.indexOf('{');
      const endIndex = input.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const jsonString = input.slice(startIndex, endIndex + 1);
        return JSON.parse(jsonString);
      }
      return null;
    } catch (error) {
      console.error('Invalid JSON content:', error);
      return null;
    }
  }



  // Generate content using Google Generative AI
  async generateContent(prompt: string){
    console.log("spotcha is invicked")
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      console.log("spotcha-18/////////////////////////////////////////////////////"+result.response.text())
      const cleanJson =  this.extractJson(result.response.text());
console.log(cleanJson)
      return cleanJson;
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
          console.log(`Generating recommendation for user: (ID: ${user._id})`);
  
          // Delay before processing each user
          const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
          await sleep(9000); // Adjust this delay as needed
  
          // Fetch OCR data for the user
          console.log(`Fetching OCR data for user: ${user._id}`);
          const ocrData = await this.getUserOcrData(user._id.toString());
          console.log(`OCR Data for user ${user._id}:`, ocrData);
  
          // Generate the prompt based on OCR data
          const prompt = `Use this information: ${ocrData} to create a health recommendation. 
          Return a JSON object with:
          {title: "A meaningful title for the recommendation", recommendation: "..."}.
          The recommendation should be specific and about a 1-minute read and please choose a creative titre and don't say based on your data  and every recommandation should speak about  some good practise and solutions and some tips and some adviceyou have many data  try to cover eachtime a topic and if there is no try to do a close topic.`;
  
          console.log(`Generated prompt for user ${user.id}:`, prompt);
  
          // Generate content based on the prompt
          const content = await this.generateContent(prompt);
          console.log(`Generated content for user ${user._id}:`, content);
          
          // Save the generated recommendation in the database
          await this.saveRecommendation(user.id,content["recommendation"],content["title"]);
  
          // Add to the recommendations list
          recommendations.push({
            userId: user._id,
            recommendation: content,
          });
  
          console.log(`Recommendation for user ${user._id} generated successfully.`);
        } catch (error) {
          console.error(`Error generating recommendation for user ${user._id}:`, error);
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
  async saveRecommendation(userId: string, recommendationContent: string,title :string): Promise<void> {
    try {
      console.log(`Saving recommendation for user ${userId}...`);
      const recommendation = new this.recommadationModel({
        user: userId,
        content: recommendationContent,
        title: title, // You can customize the title as needed
      });

      await recommendation.save();
      console.log(`Saved recommendation for user ${userId}: ${recommendationContent}`);
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw new Error('Failed to save recommendation.');
    }
  }


  
 //@Cron('*/5 * * * * *')
  //@Cron('0 0 * * *')
  async generateRecommendationsJob(): Promise<void> {
    console.log('Running scheduled job: Generating recommendations for all users...');
    try {
      const result = await this.generateRecommendationForAllUsers();
      console.log('Job completed successfully:', result.message);
    } catch (error) {
      console.error('Error during scheduled recommendation generation:', error.message);
    }
  }




































  // Fetch and dynamically extract all attributes for a specific user
  async getUserOcrData(userId: string): Promise<string> {
    try {
      const userOcrData = await this.ocrDataModel.find({ userId }).exec();

      if (!userOcrData || userOcrData.length === 0) {
        return `No OCR data found for user with ID: ${userId}`;
      }

      // Dynamically iterate over all keys for each document
      const result = userOcrData.map((doc) => {
        const attributes = Object.entries(doc.toObject()) // Convert Mongoose document to plain object
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join('\n'); // Format key-value pairs as strings

        return `OCR Entry:\n${attributes}`;
      });

      return result.join('\n\n---\n\n'); // Separate entries with "---"
    } catch (error) {
      console.error('Error fetching OCR data:', error);
      throw new Error('Failed to fetch OCR data.');
    }
  }
}







