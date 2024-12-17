import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.createImage(createImageDto);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
  @Get('getImageByUserId/:id')
  findImagesByUserID (@Param('id') id: string) {
    return this.imageService.findImagesByUserId(id);
  }



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
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string
  ) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }
      await this.imageService.createImage({title:"title1", imageName:file.path.toString(), userId});
      return { message: 'File uploaded successfully and save"d', filePath: file.path };
    } catch (error) {
      console.error('File upload error:', error); // Log the error
      return { message: 'File upload failed', error: error.message };
    }
  }
  @Post('getAllImages')
  async getAllImages(@Body('userId') userId: string) {
    console.log("dfdfgdfgdfgfdg");
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const images = await this.imageService.getAllImagesByUser(userId);
      return images;
    } catch (error) {
      console.error('Error fetching images:', error); // Log the error
      return { message: 'Failed to fetch images', error: error.message };
    }
  }
}
