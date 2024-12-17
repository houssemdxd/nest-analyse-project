/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private readonly ImageModel: Model<Image>,
  ) { }


  async createImage(data: { title: string; imageName: string; userId: string }): Promise<Image> {
    try {
      // Ensure userId is passed and is a valid ObjectId
      if (!data.userId) {
        throw new Error('User ID is required');
      }

      const image = new this.ImageModel({
        title: data.title,
        imageName: data.imageName,
        user: new Types.ObjectId(data.userId), // Convert to ObjectId
      });

      return await image.save();
    } catch (error) {
      throw new Error(`Error creating image: ${error.message}`);
    }
  }


  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }

  async findImagesByUserId(userId: string): Promise<Image[]> {
    try {
      // Find all images where the 'user' field matches the given userId
      const images = await this.ImageModel.find({ user: userId }).exec();
      return images;
    } catch (error) {
      throw new Error(`Error fetching images for user ID ${userId}: ${error.message}`);
    }
  }






  async getAllImagesByUser(userId: string): Promise<Image[]> {
    try {
      const images = await this.ImageModel.find({ user: userId }).exec();
      return images;
      
    } catch (error) {
      throw new Error(`Error fetching images: ${error.message}`);
    }
  }
  


}
