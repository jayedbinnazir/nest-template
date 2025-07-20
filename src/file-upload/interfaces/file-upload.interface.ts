import { FileType } from '../entities/file-upload.entity';

export interface IFileUploadResponse {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  extension: string;
  fileType: FileType;
  description?: string;
  uploadedBy?: string;
  isPublic: boolean;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFileUploadListResponse {
  files: IFileUploadResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface IFileUploadFilters {
  page?: number;
  limit?: number;
  search?: string;
  fileType?: FileType;
  uploadedBy?: string;
  isPublic?: boolean;
}

export interface IFileUploadStats {
  totalFiles: number;
  totalSize: number;
  filesByType: Record<FileType, number>;
  recentUploads: IFileUploadResponse[];
} 