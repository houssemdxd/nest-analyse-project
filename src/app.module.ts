import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import config from './config/config';
import { MailService } from './services/mail.service';
import { OcrModule } from './ocr/ocr.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RecommadationModule } from './recommadation/recommadation.module';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { QrService } from './qr/qr.service';
import { QrController } from './qr/qr.controller';
import { DiscussionModule } from './discussion/discussion.module';
import { ImageModule } from './image/image.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { TumorDetectionController } from './tumor_detection/tumor.detection.controller';
import { TumorDetectionService } from './tumor_detection/tumor.detection.service';
import { TumorDetectionModule } from './tumor_detection/tumor.detection.module';
import { HttpModule } from '@nestjs/axios';
import { CliniqueModule } from './clinique/clinique.module';

@Module({
  imports: [
    HttpModule,

    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'), // Adjusted to point to the root-level uploads folder
      serveRoot: '/upload', // URL prefix to access the images
    }),
    AuthModule,
    RolesModule,
    OcrModule,

    UserModule,

    RecommadationModule,
    LocationModule,
    DiscussionModule,
    ImageModule,
    PostModule,
    CommentModule,
    TumorDetectionModule,
    CliniqueModule,


  ],
  controllers: [AppController, QrController, TumorDetectionController],
  providers: [AppService, MailService, QrService,TumorDetectionService],
})
export class AppModule {}
