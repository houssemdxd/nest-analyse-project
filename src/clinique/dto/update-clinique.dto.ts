import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCliniqueDto {
  @IsOptional()
  @IsString()
  nom?: string; // Optional field for updating the name of the clinique

  @IsOptional()
  @IsString()
  region?: string; // Optional field for updating the region

  @IsOptional()
  @IsNumber()
  latitude?: number; // Optional field for updating latitude

  @IsOptional()
  @IsNumber()
  longitude?: number; // Optional field for updating longitude

  @IsOptional()
  @IsString()
  createdBy?: string; // Optional field for updating the user ID (if needed)
}
