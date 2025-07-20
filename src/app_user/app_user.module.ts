import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { AppUserController } from './controllers/app_user.controller';
import { AppUserService } from './services/app_user.service';

import { UserRole } from '../user_role/entities/user_role.entity';
import { AppUser } from './entities/app_user.entity';
import { UserFile } from '../user_file/entities/user_file.entity';
import { UserFileModule } from "../user_file/user_file.module"
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser ,UserFile,UserRole]) , FileUploadModule , UserFileModule ],
  controllers: [AppUserController],
  providers: [AppUserService ],
  exports: [AppUserService],
})
export class AppUserModule {}
