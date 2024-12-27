import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async generateQrForUser(userId: string): Promise<string> {
    // Fetch the user by ID
    const user = await this.userModel.findById(userId).populate('roleId').exec();
  
    if (!user) {
      throw new Error('User not found.');
    }
  
    // Fetch the role information
    const role = user.roleId as Role; // Ensure the role is populated
  
    // Create the message for the QR code
    const qrMessage = `Hi, ${user.name} : ${userId} is a ${role.name}`;
  
    // Generate the QR code
    return QRCode.toDataURL(qrMessage);
  }
  
}
