import { IsString, IsOptional, IsDate } from 'class-validator';

export class CategoryResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsOptional()
  @IsDate()
  deleted_at?: Date | null;
} 