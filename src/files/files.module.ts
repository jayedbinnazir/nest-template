import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { FilesController } from './controllers/files.controller';
import { MulterConfigService } from './services/multer.config.service';
import { FileUser } from './entities/file.user.entity';
import { FilesUserService } from './services/files.user.service';
import { FileProduct } from './entities/file.product.entity';
import { FilesProductService } from './services/file.product.service';


@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ FileUser ,  FileProduct]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: MulterConfigService,
    }),
    ConfigModule,
  ],
  controllers: [FilesController],
  providers: [ FilesUserService,FilesProductService ,MulterConfigService],
  exports: [FilesUserService,FilesProductService, MulterConfigService],
})
export class FilesModule {}
