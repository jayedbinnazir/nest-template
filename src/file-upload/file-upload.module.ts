import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';

import { multerConfig } from './multer.config';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadController } from './controllers/file-upload.controller';

@Module({
  imports: [
    MulterModule.register(multerConfig),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
