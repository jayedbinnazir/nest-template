import { IsString, IsEnum, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { FileType, StorageProvider } from '../entities/file-upload.entity';

export class CreateFileUploadDto {
  @IsString()
  originalName: string;

  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsString()
  mimetype: string;

  @IsNumber()
  size: number;

  @IsString()
  extension: string;

  @IsEnum(FileType)
  @IsOptional()
  fileType?: FileType;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  url?: string;

  @IsEnum(StorageProvider)
  @IsOptional()
  storageProvider?: StorageProvider;

  @IsOptional()
  storageMeta?: any;
}