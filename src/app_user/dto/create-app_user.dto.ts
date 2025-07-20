import { Transform } from "class-transformer";
import {  IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateAppUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profile_picture?:string
}

