import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Post()
    async findNearest(@Body() body: { latitude: number; longitude: number }) {
        try {
            const { latitude, longitude } = body;
            return await this.locationService.findNearest(latitude, longitude);
        } catch (error) {
            throw new HttpException(
                'Unable to fetch location data',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
