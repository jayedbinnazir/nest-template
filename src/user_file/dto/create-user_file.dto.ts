import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserFileDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  file_id: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsOptional()
  meta?: any;
}
