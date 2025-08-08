import { Transform } from "class-transformer";
import {  IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {
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
  @Transform(({ value }) => String(value).trim())
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim())
  @MinLength(6)
  confirmPassword: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === null) || (value==="") ? undefined : String(value).trim())
  phone?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === null) || (value==="") ? undefined : String(value).trim())
  address?: string;
}

