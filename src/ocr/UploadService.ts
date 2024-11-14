/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { OCRService } from './ocr.service';
import {OCRServiceextraction} from './ocrextraction'
import * as Tesseract from 'tesseract.js';

@Controller('files')
export class FileUploadController {
  constructor(private readonly ocrService: OCRService,

    private readonly OCRServiceextraction: OCRServiceextraction,
    
  ) {}

  oldImageName : string =""
  
  @Get()
  async analyzeImage(imageName:string) {
    try {
      var mediaPath="upload";
      const analysisResult = await this.OCRServiceextraction.analyzeImage(mediaPath, imageName);

      return analysisResult ;
    } catch (error) {
      return { error: 'Image analysis failed', details: error.message };
    }
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadDir = './upload';  // Local folder to store files
        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir);
      },
      filename: (req, file, callback) => {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

        const extension = extname(file.originalname);

        callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }
      var a=  this.extractTextFromImage("D:\\spring\\22.png")

      console.log('File info:', file.filename , "extracted text" ,a) ; // Log file details for debugging
      const extractedData = await this.analyzeImage(file.filename); // Implement your OCR logic here
      extractedData["image_document"] = file.filename;  // Replace "New Key" and "New Value" with your desired key and value
      return this.ocrService.saveExtractedData(extractedData);
      return { message: 'File uploaded successfully', filePath: file.path };
    } catch (error) {
      console.error('File upload error:', error); // Log the error
      return { message: 'File upload failed', error: error.message };
    }
  }




  async  extractTextFromImage(filePath) {
    try {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(m), // optional: shows progress in the console
      });
  
      console.log('Extracted Text:', text);
      return text;
    } catch (error) {
      console.error('Error during OCR processing:', error);
      throw new Error('OCR processing failed');
    }
  }
  
  

}
