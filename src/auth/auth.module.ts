import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratigy/jwt.strategy';
import { JwtCookieStrategy } from './stratigy/jwt-cookie.strategy';
import { AppUserModule } from '../app_user/app_user.module';
import { UserRoleModule } from '../user_role/user_role.module';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    AppUserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    UserRoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,  JwtStrategy, JwtCookieStrategy],
  exports: [AuthService],
})
export class AuthModule {}
