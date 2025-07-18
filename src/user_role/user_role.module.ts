import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleService } from './services/user_role.service';
import { UserRoleController } from './controllers/user_role.controller';
import { UserRole } from './entities/user_role.entity';
import { AppUser } from '../app_user/entities/app_user.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, AppUser, Role])],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
