import { Transform } from "class-transformer";
import {  IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateAppUserDto {
   
  @IsString()
  @IsNotEmpty()
  user_id:string;


  @IsString()
  @IsNotEmpty()
  role_id:string;
}

