// services/qr.service.ts
import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//import { OCRDataSchema } from 'src/ocr/entities/ocr.entity';
//import { OCRData } from 'src/ocr/entities/ocr.entity';
import { OCRData } from '../ocr/OCRData';
import { OcrModule } from 'src/ocr/ocr.module';

@Injectable()
export class QrService {
    

    async generateQrForUser(userId: string): Promise<string> {
        // Fetch all medical files for the user
       // const ocrs = await this.ocrDataModel.find({ userId }).lean().exec();

       // if (!ocrs || ocrs.length === 0) {
       //     throw new Error('No medical files found for this user.');
      //  }

        // Generate QR code containing medical files as JSON
        const jsonData = JSON.stringify(userId+":   id houssem");
        return QRCode.toDataURL(jsonData);
    }
}
