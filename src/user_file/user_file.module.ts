import { Module } from '@nestjs/common';
import { UserFileService } from './user_file.service';
import { UserFileController } from './user_file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFile } from './entities/user_file.entity';
import { AppUser } from '../app_user/entities/app_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFile , AppUser])],
  controllers: [UserFileController ],
  providers: [UserFileService],
  exports:[UserFileService]
})
export class UserFileModule {}
