// src/dto/create-comment.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  post: string;

  @IsOptional()
  @IsString()
  comment: string;
}
