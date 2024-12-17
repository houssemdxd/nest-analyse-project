import { Controller, Get, Post, Body, Query, Delete, Param, Put } from '@nestjs/common';
import { CliniqueService } from './clinique.service';
import { CreateCliniqueDto } from './dto/create-clinique.dto';
import { UpdateCliniqueDto } from './dto/update-clinique.dto';

@Controller('cliniques')
export class CliniqueController {
  constructor(private readonly cliniqueService: CliniqueService) {}

  // Create a new clinique
  @Post('create')
  async create(@Body() createCliniqueDto: CreateCliniqueDto) {
    try {
      const clinique = await this.cliniqueService.create(createCliniqueDto);
      return { success: true, message: 'Clinique created successfully', data: clinique };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Fetch all cliniques
  @Get()
  async findAll() {
    try {
      const cliniques = await this.cliniqueService.findAll();
      return { success: true, data: cliniques };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }


    // Fetch all cliniques
    @Get('clinics')
    async findAllHoussem() {
      console.log("this function is called");
      try {
        const cliniques = await this.cliniqueService.findAll();
        return { cliniques };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  

  // Search cliniques by region
  @Get('search')
  async search(@Query('region') region: string) {
    try {
      const cliniques = await this.cliniqueService.searchByRegion(region);
      return { success: true, data: cliniques };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCliniqueDto: UpdateCliniqueDto) {
    try {
      const clinique = await this.cliniqueService.update(id, updateCliniqueDto);
      return { success: true, message: 'Clinique updated successfully', data: clinique };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Delete a clinique
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const isDeleted = await this.cliniqueService.delete(id);
      if (isDeleted) {
        return { success: true, message: 'Clinique deleted successfully' };
      } else {
        return { success: false, message: 'Clinique not found' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
