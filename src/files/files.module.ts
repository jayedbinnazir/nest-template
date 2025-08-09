import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { MulterConfigService } from './services/multer.config.service';
import { FileUpload } from './entities/file.entity';


@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([FileUpload]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: MulterConfigService,
    }),
    ConfigModule,
  ],
  controllers: [FilesController],
  providers: [FilesService, MulterConfigService],
  exports: [FilesService, MulterConfigService],
})
export class FilesModule {}
