import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto {
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    session_id?:string|null
}