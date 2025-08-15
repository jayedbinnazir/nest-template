import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppUserModule } from './app_user/app_user.module';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './exceptions/custom-exception.filter';
import { RoleModule } from './role/role.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from 'data-source';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { FilesModule } from './files/files.module';
import { CategoryModule } from './category/category.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import configuration from 'Config/configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        const env = process.env.NODE_ENV;
        switch (env) {
          case 'production':
          case 'prod':
            console.log('NODE_ENV is in production mode, loading .env');
            return '.env';
          case 'test':
            console.log('NODE_ENV is in test mode, loading .env and .env.test');
            return ['.env', '.env.test'];
          case 'development':
          case 'dev':
            console.log('NODE_ENV is in development mode, loading .env.dev');
            return '.env.dev';
          default:
            console.log('NODE_ENV is not set, defaulting to .env');
            return '.env';
        }
      })(),
      load: [configuration],
    }),
    TerminusModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ()=>AppDataSource.options,
    }),
    FilesModule, // Added missing AuthModule
    RoleModule,
    AwsS3Module,
    AppUserModule,
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    ProductCategoryModule,
    

  ],
  controllers: [AppController, HealthController],
  providers: [AppService,{
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  }],
})
export class AppModule {}
