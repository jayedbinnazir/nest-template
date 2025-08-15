import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Controller } from './aws-s3.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [ConfigModule],
  controllers: [AwsS3Controller],
  providers: [AwsS3Service , {
    provide: "S3_CLIENT",
    useFactory: (configService: ConfigService) => {
      console.log("configService",configService.get("s3"));
       return new S3Client({
            region: configService.get('s3.region'),
            credentials: {
                accessKeyId: configService.get('s3.accessKeyId') as string,
                secretAccessKey: configService.get('s3.secretAccessKey') as string,
            },
        })
    },
    inject: [ConfigService],
  }],
})
export class AwsS3Module {}
