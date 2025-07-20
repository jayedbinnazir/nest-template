import { FileType, StorageProvider } from '../entities/file-upload.entity';

export class FileUploadResponseDto {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  extension: string;
  fileType: FileType;
  isPublic: boolean;
  url: string;
  storageProvider: StorageProvider;
  storageMeta: any;
  uploadedAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}