import { Controller, Get, Param } from '@nestjs/common';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
    constructor(private readonly qrService: QrService) {}

    @Get(':userId')
    async generateQrForUser(@Param('userId') userId: string): Promise<{ qrCode: string }> {
        const qrCode = await this.qrService.generateQrForUser(userId);
        return { qrCode };
    }
}
