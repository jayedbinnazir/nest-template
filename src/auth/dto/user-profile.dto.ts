import { IsString, IsOptional } from 'class-validator';

export class UserProfileDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  name: string;
} 