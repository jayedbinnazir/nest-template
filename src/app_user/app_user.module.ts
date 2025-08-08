import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserController } from './controllers/app_user.controller';
import { AppUserService } from './services/app_user.service';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { AppUser } from './entities/app_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser])],
  controllers: [AppUserController],
  providers: [AppUserService ],
  exports: [AppUserService],
})
export class AppUserModule {}
