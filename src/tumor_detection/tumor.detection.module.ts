import { Module } from '@nestjs/common';
import { TumorDetectionController } from './tumor.detection.controller';
import { TumorDetectionService } from './tumor.detection.service';
import { HttpModule } from '@nestjs/axios';


@Module({
    imports: [HttpModule],

    controllers: [TumorDetectionController],
    providers: [TumorDetectionService],
})
export class TumorDetectionModule { }
