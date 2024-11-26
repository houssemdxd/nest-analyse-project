import { ApiProperty } from '@nestjs/swagger';
import { IsString,MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description : 'the  reset token',
    example : 'cqezjdazufhzai53fezhfgzu'
  })
  @IsString()
  resetToken: string;

  
  @ApiProperty({
    description : 'the new password of the user',
    example : 'Pass*1235'
  })
  @IsString()
  @MinLength(6)
  //@Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  newPassword: string;
}
