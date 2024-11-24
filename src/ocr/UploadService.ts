/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { OCRService } from './ocr.service';
import {OCRServiceextraction} from './ocrextraction'
import { CreateOcrDto } from './dto/create-ocr.dto';
import { ApiOperation, ApiRequestTimeoutResponse, ApiResponse, ApiTags, ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';
@ApiTags('OCR')
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

@ApiResponse({ status: 201, description: 'file uploaded successfully .'})
@ApiResponse({ status: 403, description: 'Forbidden.'})
@ApiRequestTimeoutResponse()
@ApiOperation({ summary: 'Upload a file' })
  @ApiUnsupportedMediaTypeResponse({
    description: 'The server does not support the media type of the request payload.',
  })
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
  async uploadFile(@UploadedFile() file: Express.Multer.File ,  @Body('userId') userId: string
 ) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }
      console.log('File info:', file.filename); // Log file details for debugging
      console.log('User ID:', userId); // Log user ID for debugging

      const extractedData = await this.analyzeImage(file.filename); // Implement your OCR logic here
      console.log(extractedData)
      extractedData["image_name"] = file.filename
      await this.ocrService.saveExtractedData(extractedData, userId);

      return { message: 'File uploaded successfully and saved', filePath: file.path };
    } catch (error) {
      console.error('File upload error:', error); // Log the error
      return { message: 'File upload failed', error: error.message };
    }
  }





  @Post('getAllImages')
  async forgotPassword(@Body() forgotPasswordDto: CreateOcrDto) {
    console.log("get images invocked")
    return  this.ocrService.findAllByUserId(forgotPasswordDto.id);
    console.log("")
  }


  @Post('getImageDetails')
  async getImageDeatails(@Body() forgotPasswordDto: CreateOcrDto) {
    return  this.ocrService.getImageDetail(forgotPasswordDto.id);
  }





}
