import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtCookieStrategy } from './stratigy/jwt-cookie.strategy';
import { AppUserModule } from '../app_user/app_user.module';
import { AuthController } from './controllers/auth.controller';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthUtils } from './utils/auth';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { MulterConfigService } from 'src/files/services/multer.config.service';

@Module({
  imports: [
   MulterModule.registerAsync({
         imports: [ConfigModule],
         useClass: MulterConfigService,
       }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule,
    AppUserModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUtils,  JwtCookieStrategy],
  exports: [AuthService],
})
export class AuthModule {}
