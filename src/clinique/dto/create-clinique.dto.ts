import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCliniqueDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  region: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  createdBy: string; // User ID
}
