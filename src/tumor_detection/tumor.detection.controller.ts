import { Controller, Post, Body } from '@nestjs/common';
import { TumorDetectionService } from './tumor.detection.service';


@Controller('tumor-detection')
export class TumorDetectionController {
  constructor(private readonly tumorDetectionService: TumorDetectionService) {}

  @Post()
  async detectTumor(@Body('imagePath') imagePath: string): Promise<any> {
    console.log("-------------------");
    return this.tumorDetectionService.detectTumor(imagePath);
  }
}