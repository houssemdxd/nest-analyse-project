/*import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCliniqueDto } from './dto/create-clinique.dto';
import { Clinique } from './entities/clinique.entity';

@Injectable()
export class CliniqueService {
  constructor(@InjectModel(Clinique.name) private cliniqueModel: Model<Clinique>) {}

  // Create a new clinique
  async create(createCliniqueDto: CreateCliniqueDto): Promise<Clinique> {
    try {
      const createdClinique = new this.cliniqueModel(createCliniqueDto);
      return await createdClinique.save();
    } catch (error) {
      throw new Error('Error creating clinique: ' + error.message);
    }
  }

  // Fetch all cliniques
  async findAll(): Promise<Clinique[]> {
    try {
      return await this.cliniqueModel.find().exec();
    } catch (error) {
      throw new Error('Error fetching cliniques: ' + error.message);
    }
  }

  // Search cliniques by region
  async searchByRegion(region: string): Promise<Clinique[]> {
    try {
      return await this.cliniqueModel.find({ region: { $regex: region, $options: 'i' } }).exec();
    } catch (error) {
      throw new Error('Error searching cliniques by region: ' + error.message);
    }
  }
}
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCliniqueDto } from './dto/create-clinique.dto';
import { Clinique } from './entities/clinique.entity';
import axios from 'axios';
import { UpdateCliniqueDto } from './dto/update-clinique.dto';

@Injectable()
export class CliniqueService {
  constructor(@InjectModel(Clinique.name) private cliniqueModel: Model<Clinique>) {}

  async create(createCliniqueDto: CreateCliniqueDto): Promise<Clinique> {
    try {
      // Automatically detect the region based on latitude and longitude
      const region = await this.getRegionFromCoordinates(createCliniqueDto.latitude, createCliniqueDto.longitude);
      createCliniqueDto.region = region || 'Unknown';  // Set region to 'Unknown' if not found
  
      const createdClinique = new this.cliniqueModel(createCliniqueDto);
      return await createdClinique.save();
    } catch (error) {
      throw new Error('Error creating clinique: ' + error.message);
    }
  }
  

  // Fetch all cliniques
  async findAll(): Promise<Clinique[]> {
    try {
      return await this.cliniqueModel.find().exec();
    } catch (error) {
      throw new Error('Error fetching cliniques: ' + error.message);
    }
  }

  // Search cliniques by region
  async searchByRegion(region: string): Promise<Clinique[]> {
    try {
      return await this.cliniqueModel.find({ region: { $regex: region, $options: 'i' } }).exec();
    } catch (error) {
      throw new Error('Error searching cliniques by region: ' + error.message);
    }
  }

  // Get region from coordinates using Nominatim (OpenStreetMap)
  private async getRegionFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
      const response = await axios.get(url);
      const data = response.data;
  
      if (data && data.address && data.address.state) {
        return data.address.state;  // Return the region/state from the response
      }
      return null;  // Return null if no region is found
    } catch (error) {
      console.error('Error fetching region:', error);
      return null;  // Return null if there's an error
    }
  }

   // Update a clinique by ID
   async update(id: string, updateCliniqueDto: UpdateCliniqueDto): Promise<Clinique> {
    try {
      const updatedClinique = await this.cliniqueModel.findByIdAndUpdate(id, updateCliniqueDto, { new: true });
      if (!updatedClinique) {
        throw new Error('Clinique not found');
      }
      return updatedClinique;
    } catch (error) {
      throw new Error('Error updating clinique: ' + error.message);
    }
  }

  // Delete a clinique
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.cliniqueModel.findByIdAndDelete(id).exec();
      return result !== null;  // Return true if deletion was successful, false otherwise
    } catch (error) {
      throw new Error('Error deleting clinique: ' + error.message);
    }
  }
  
}
