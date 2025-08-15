import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppUserModule } from '../app_user/app_user.module';
import { FilesModule } from '../files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../files/services/multer.config.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [TypeOrmModule.forFeature([User]), MulterModule.registerAsync({
    imports: [ConfigModule],
    useClass: MulterConfigService,
  }), AppUserModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export UserService so other modules can use it
})
export class UserModule { }
