import axios from 'axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';

@Injectable()
export class TumorDetectionService {
  constructor(private readonly httpService: HttpService) {}

  async detectTumor(imagePath: string): Promise<any> {
    console.log("-------------------");
    const correctedFilePath = imagePath.replace(/\\/g, '/');

    try {
      // Read and encode the image
      const image = fs.readFileSync(correctedFilePath, { encoding: 'base64' });

      // Define API key and URL
      const apiKey = '7SCqgtK410AC9qQlCVLF'; // Replace with your actual API key
      const url = 'https://detect.roboflow.com/tumor-detection-j9mqs/1';
      console.log("-------------------");
      // Send the request
      const response = await lastValueFrom(
        this.httpService.post(url, image, {
          params: { api_key: apiKey },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );
      console.log(correctedFilePath);

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Tumor detection failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
