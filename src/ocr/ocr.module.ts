/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { OCRService } from './ocr.service';
import { OCRController } from './ocr.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OCRDataSchema } from './entities/ocr.entity';
import {OCRServiceextraction } from './ocrextraction'
import {FileUploadController} from './UploadService'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'OCRData', schema: OCRDataSchema }]), // Register OCRData model
  ],
  controllers: [OCRController,FileUploadController],
  providers: [OCRService, OCRServiceextraction],
})
export class OcrModule {}
