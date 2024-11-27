import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'the email of the user',
    example: 'exemple@gmail.com'
  })
  @IsEmail()
  email: string;



  @ApiProperty({
    description: 'the password of the user',
    example: 'Pass*123'
  })
  @IsString()
  password: string;

}
