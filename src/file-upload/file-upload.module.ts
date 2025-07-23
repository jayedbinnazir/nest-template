import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadController } from './controllers/file-upload.controller';
import { FileUpload } from './entities/file-upload.entity';
import { createMulterConfig } from './multer.config';
import { UserFileModule } from 'src/user_file/user_file.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([FileUpload]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log("usefactory called of file-upload.module.ts");
        console.log("process.cwd()--------<", process.cwd()+'/public/uploads');
        return createMulterConfig({
          maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB default
          uploadPath: process.cwd() + '/public/uploads',
          allowedMimeTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'text/csv',
            'text/plain',
            'video/mp4',
            'video/webm',
            'audio/mpeg',
            'audio/wav',
          ]
        });
      },
    }),
    UserFileModule
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
