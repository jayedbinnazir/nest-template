import { Module } from '@nestjs/common';

import { UserFileController } from './controllers/user_file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFile } from './entities/user_file.entity';
import { AppUser } from '../app_user/entities/app_user.entity';
import { UserFileService } from './services/user_file.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserFile , AppUser])],
  controllers: [UserFileController ],
  providers: [UserFileService],
  exports:[UserFileService]
})
export class UserFileModule {}
