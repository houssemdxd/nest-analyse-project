import { Module } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { QrCodeController } from './qr-code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';

@Module({
   imports: [ 
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Role.name, schema: RoleSchema },
              
        
      ])],
  controllers: [QrCodeController],
  providers: [QrCodeService],
})
export class QrCodeModule {}
