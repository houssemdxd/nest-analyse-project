import { IsString } from "class-validator";

export class CreateImageDto {



    @IsString()

    title: string; // Optional: name of the discussion
    @IsString()

    imageName: string; // Optional: name of the discussion
  
    
    @IsString()
    userId:string



}
