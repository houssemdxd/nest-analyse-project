import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description : 'the refresh token',
    example : 'fbhezsbfzefhaeouiazae4658ezfzfjezhi'
  })
  @IsString()
  refreshToken: string;
}
