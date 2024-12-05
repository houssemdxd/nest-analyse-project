import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  imageId: string;
  @IsString()
  content :string
  @IsString()
  userid:string
  @IsString()
  @IsNotEmpty()
  subreddit: string;
}
