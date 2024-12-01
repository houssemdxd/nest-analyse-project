import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: 'the name of the user',
    example: 'johne'
  })
  @IsString()
  name: string;


  @ApiProperty({
    description: 'the email of the user',
    example: 'johne@gmail.com'
  })
  @IsEmail()
  email: string;




  @ApiProperty({
    description: 'the password of the user',
    example: 'Pass*123'
  })
  @IsString()
  @MinLength(6)
  // @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  password: string;


  @IsString()
  role: string = "patient"
}
