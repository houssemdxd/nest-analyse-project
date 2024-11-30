import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommadationService } from './recommadation.service';
import { GoogleAIController } from './recommadation.controller';
import { Recommadation, RecommadationSchema } from './entities/recommadation.entity';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { OcrModule } from 'src/ocr/ocr.module';
import { OCRDataSchema } from 'src/ocr/entities/ocr.entity';
import { HttpModule } from '@nestjs/axios';

 
@Module({
  imports: [    ScheduleModule.forRoot(), // Enable scheduler
HttpModule,
    MongooseModule.forFeature([
      { name: Recommadation.name, schema: RecommadationSchema },
      { name: User.name, schema: UserSchema },
        { name: 'OCRData', schema: OCRDataSchema },
    ]),
    OcrModule,
  ],
  controllers: [GoogleAIController],
  providers: [RecommadationService],
  exports: [RecommadationService], // Export the service if used in other modules
})
export class RecommadationModule {}
