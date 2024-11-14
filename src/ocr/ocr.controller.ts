/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OCRService } from './ocr.service';
import {OCRServiceextraction} from './ocrextraction'
@Controller('ocr')
export class OCRController {
  constructor(private readonly ocrService: OCRService,

    private readonly OCRServiceextraction: OCRServiceextraction,
    
  ) {}

  @Post()
  async handleOCR(): Promise<any> {
    const extractedData = await this.analyzeImage(); // Implement your OCR logic here

    return this.ocrService.saveExtractedData(extractedData);
  }





  @Get()
  async analyzeImage() {
    try {
      var mediaPath="D:/MediShareBack-main";
      var imageName="jetpack1.png";
      const analysisResult = await this.OCRServiceextraction.analyzeImage(mediaPath, imageName);

      return analysisResult ;
    } catch (error) {
      return { error: 'Image analysis failed', details: error.message };
    }
  }




}
