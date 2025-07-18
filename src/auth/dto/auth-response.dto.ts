import { IsString, IsObject, IsOptional } from 'class-validator';

export class AuthResponseDto {
  @IsObject()
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: Date;
    updated_at: Date;
  };

  @IsString()
  access_token: string;

  @IsString()
  message: string;
} 