import { extname } from 'path';
import { FileType } from '../entities/file-upload.entity';

export class FileUtils {
  static getFileExtension(filename: string): string {
    return extname(filename).toLowerCase();
  }

  static getFileType(mimetype: string): FileType {
    if (mimetype.startsWith('image/')) {
      return FileType.IMAGE;
    } else if (
      mimetype.startsWith('application/pdf') ||
      mimetype.startsWith('application/msword') ||
      mimetype.startsWith('application/vnd.openxmlformats') ||
      mimetype.startsWith('text/')
    ) {
      return FileType.DOCUMENT;
    } else if (
      mimetype.startsWith('application/zip') ||
      mimetype.startsWith('application/x-rar') ||
      mimetype.startsWith('application/x-7z')
    ) {
      return FileType.ARCHIVE;
    } else if (mimetype.startsWith('video/')) {
      return FileType.VIDEO;
    } else if (mimetype.startsWith('audio/')) {
      return FileType.AUDIO;
    }
    return FileType.OTHER;
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  static generateUniqueFilename(originalName: string): string {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = this.sanitizeFilename(originalName);
    return `${uniqueSuffix}-${sanitizedName}`;
  }

  static isValidFileType(mimetype: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimetype);
  }

  static isValidFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }

  static getYearMonthPath(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}`;
  }

  static isVideoFile(mimetype: string): boolean {
    return mimetype.startsWith('video/');
  }

  static isAudioFile(mimetype: string): boolean {
    return mimetype.startsWith('audio/');
  }

  static isMediaFile(mimetype: string): boolean {
    return this.isVideoFile(mimetype) || this.isAudioFile(mimetype);
  }

  static getMediaDurationEstimate(size: number, mimetype: string): number | null {
    // Rough estimation based on file size and type
    // This is a very basic estimation and not accurate
    if (this.isVideoFile(mimetype)) {
      // Assume ~1MB per minute for compressed video
      return Math.round(size / (1024 * 1024));
    } else if (this.isAudioFile(mimetype)) {
      // Assume ~1MB per 10 minutes for compressed audio
      return Math.round((size / (1024 * 1024)) * 10);
    }
    return null;
  }

  static getRecommendedMaxSize(fileType: FileType): number {
    switch (fileType) {
      case FileType.IMAGE:
        return 10 * 1024 * 1024; // 10MB
      case FileType.DOCUMENT:
        return 50 * 1024 * 1024; // 50MB
      case FileType.ARCHIVE:
        return 500 * 1024 * 1024; // 500MB
      case FileType.VIDEO:
        return 2 * 1024 * 1024 * 1024; // 2GB
      case FileType.AUDIO:
        return 500 * 1024 * 1024; // 500MB
      default:
        return 100 * 1024 * 1024; // 100MB
    }
  }
} 