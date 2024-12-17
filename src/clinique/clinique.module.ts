import { Module } from '@nestjs/common';
import { CliniqueService } from './clinique.service';
import { CliniqueController } from './clinique.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Clinique, CliniqueSchema } from './entities/clinique.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Clinique.name, schema: CliniqueSchema }]),
  ],
  controllers: [CliniqueController],
  providers: [CliniqueService],
})
export class CliniqueModule {}
