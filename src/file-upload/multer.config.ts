import { diskStorage } from 'multer';
import { join } from 'path';
import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Default to 'public/uploads', can be overridden per module if needed
      cb(null, join(__dirname, '..','..', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Allow pdf, csv, jpg, jpeg, png
    const allowed = [
      'application/pdf',
      'text/csv',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error('Only PDF, CSV, JPG, and PNG files are allowed!'),
        false,
      );
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB
}; 