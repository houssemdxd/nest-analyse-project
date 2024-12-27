import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { isValidObjectId } from 'mongoose';


@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
/*
  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.createImage(createImageDto);
  }*/

    @Post()
    async create(@Body() createImageDto: CreateImageDto) {
      try {
        // Exemple d'utilisation correcte de CreateImageDto avec patientId
        const createdImage = await this.imageService.createImage({
          title: createImageDto.title,
          imageName: createImageDto.imageName,
          userId: createImageDto.userId,
          patientId: createImageDto.patientId, // Assurez-vous que patientId est passé
        });
        return {
          message: 'Image successfully created',
          data: createdImage,
        };
      } catch (error) {
        throw new BadRequestException(`Error creating image: ${error.message}`);
      }
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
        const uploadDir = './upload';
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
    @Body('patientId') patientId: string,
    @Body('title') title: string
  ) {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }
      if (!userId || !isValidObjectId(userId)) {
        throw new Error('Invalid or missing User ID');
      }
      if (!patientId || !isValidObjectId(patientId)) {
        throw new Error('Invalid or missing Patient ID');
      }
      if (!title || title.trim() === '') {
        throw new Error('Title is required');
      }
  
      await this.imageService.createImage({
        title,
        imageName: file.path.toString(),
        userId,
        patientId,
      });
  
      return { message: 'File uploaded successfully and saved', filePath: file.path };
    } catch (error) {
      console.error('File upload error:', error);
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
  /*
  @Get('imagesPatient')
async getImages(@Query('userId') userId: string, @Query('patientId') patientId: string) {
  try {
    const images = await this.imageService.getAllImagesByUserAndPatient(userId, patientId);
    return {
      message: 'Images retrieved successfully',
      data: images,
    };
  } catch (error) {
    throw new BadRequestException(`Error fetching images: ${error.message}`);
  }
}*/
@Post('getImagesByPatient')
async getImagesByPatient(@Body() body: { userId: string, patientId: string }) {
  try {
    const { userId, patientId } = body;

    if (!userId || !patientId) {
      throw new BadRequestException('Both userId and patientId are required');
    }

    const images = await this.imageService.getAllImagesByUserAndPatient(userId, patientId);
    return {
      message: 'Images retrieved successfully',
      data: images,
    };
  } catch (error) {
    throw new BadRequestException(`Error fetching images: ${error.message}`);
  }
}


}
