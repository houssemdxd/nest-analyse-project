import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserIndoDto {
  @ApiProperty({
    description : 'the name of the user',
    example : 'johne'
  })
  @IsString()
  name: string;
  @ApiProperty({
    description : 'the email of the user',
    example : 'johne@gmail.com'
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description : 'the id of the user',
    example : 'hd595dezj66'
  })
  @IsString()
  userId : string;
}
