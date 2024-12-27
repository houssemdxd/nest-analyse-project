import { Controller, Get, Param } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';


@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Get(':userId')
  async generateQrForUser(@Param('userId') userId: string): Promise<{ qrCode: string }> {
    console.log("hani jit hadhemi")
      const qrCode = await this.qrCodeService.generateQrForUser(userId);
      console.log("haw bech nekhdem")
      console.log(qrCode)


      return { qrCode };
  }
}
