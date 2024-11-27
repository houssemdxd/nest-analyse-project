import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description : 'the email of the user',
    example : 'exemple@gmail.com'
  })
  @IsEmail()
  email: string;
}