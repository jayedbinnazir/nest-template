import { IsString, IsObject, IsNumber, IsOptional } from 'class-validator';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  created_at: Date;

  @IsString()
  updated_at: Date;

  @IsOptional()
  @IsString()
  deleted_at?: Date | null;
}

export class DeleteResponseDto {
  @IsString()
  message: string;

  @IsObject()
  user: UserResponseDto;
}

export class HardDeleteResponseDto {
  @IsString()
  message: string;

  @IsObject()
  deletedUser: UserResponseDto;
}

export class BulkDeleteResponseDto {
  @IsString()
  message: string;

  @IsNumber()
  deletedCount: number;
}

export class BulkRestoreResponseDto {
  @IsString()
  message: string;

  @IsNumber()
  restoredCount: number;
} 