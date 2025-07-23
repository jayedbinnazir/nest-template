import { diskStorage } from 'multer';
import { join } from 'path';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { extname } from 'path';

export interface FileUploadConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  uploadPath: string;
}

export const defaultFileUploadConfig: FileUploadConfig = {
  maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB default (increased for large files)
  allowedMimeTypes: [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // Text files
    'text/plain',
    'text/csv',
    'text/html',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    // Video files
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/x-flv',
    'video/webm',
    'video/ogg',
    'video/3gpp',
    'video/3gpp2',
    // Audio files
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/flac',
    'audio/webm',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'audio/x-ms-wma',
  ],
  uploadPath: 'public/uploads',
};

export const createMulterConfig = (config: Partial<FileUploadConfig> = {}): MulterModuleOptions => {
  const finalConfig = { ...defaultFileUploadConfig, ...config };
  console.log("finalConfig--------<", finalConfig);
  console.log("createMulterConfig called of multer.config.ts");
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        console.log("destination called of multer.config.ts");

        // Create year/month based folder structure
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const uploadPath = join(process.cwd(), finalConfig.uploadPath, String(year), month);
        console.log("uploadPath--------<", uploadPath);
        // Ensure directory exists
        const fs = require('fs');
        if (!fs.existsSync(uploadPath)) {
          console.log("uploadPath not exists, creating it");
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = extname(file.originalname);
        const baseName = file.originalname
          .replace(fileExtension, '') // Remove extension from original name
          .replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize base name
        cb(null, `${uniqueSuffix}-${baseName}${fileExtension}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!finalConfig.allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new Error(`File type not allowed. Allowed types: ${finalConfig.allowedMimeTypes.join(', ')}`),
          false,
        );
      }
      cb(null, true);
    },
    limits: {
      fileSize: finalConfig.maxFileSize,
      files: 10, // Maximum 10 files per request
    },
  };
};

// Default export for backward compatibility
export const multerConfig = createMulterConfig(); 