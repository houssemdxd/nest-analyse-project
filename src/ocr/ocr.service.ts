/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OCRData } from './OCRData';

@Injectable()
export class OCRService {
  constructor(@InjectModel('OCRData') private ocrDataModel: Model<OCRData>,   
) {}

  async saveExtractedData(extractedFields: Record<string, any>){
    var  ocrData = new this.ocrDataModel(extractedFields);


  return ocrData.save();

     
  }
}
