import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description : 'the old password of the user',
    example : 'Pass*123'
  })
  @IsString()
  oldPassword: string;
  @ApiProperty({
    description : 'the id of the user',
    example : '1256dehbe652'
  })
  @IsString()
  userId:string
  @ApiProperty({
    description : 'the new password of the user',
    example : 'Pass*1234'
  })
  @IsString()
  @MinLength(6)
  //@Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  newPassword: string;
}
