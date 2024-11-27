import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { join } from 'path';  // Importe join pour le chemin
import * as express from 'express';  // Importe express
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
// Rendre le dossier accessible pour les téléchargements
app.use('../upload', express.static(join(__dirname, '..', 'upload')));


const config = new DocumentBuilder()
.setTitle('MediShare')
.setDescription('MediShare API description')
.setVersion('1.0')
.addTag('default')
.build();
const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);
  

await app.listen(3000);
}
bootstrap();
