import { Inject, Injectable } from '@nestjs/common';
import { CreateAwsS3Dto } from './dto/create-aws-s3.dto';
import { UpdateAwsS3Dto } from './dto/update-aws-s3.dto';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  private getBucketName():string {
    return this.configService.get('s3.bucketName') as string;
  }

  // async uploadFile(file: Express.Multer.File , key: string):Promise<string> {
  //   const command = new PutObjectCommand({
  //     Bucket: this.getBucketName(),
  //     Key: file.originalname,
  //     Body: file.buffer,
  //   });

  //   await this.s3Client.send(command);
  //   return key;
  // }

  async uploadFileUrl(fileName:string):Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.getBucketName(),
      Key: `uploads/${fileName}`,
      ContentType: "image/jpg",
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return url;
  }


  async getSignedUrl(key: string , expiresIn: number = 3600):Promise<string> {
    console.log("bucket name",this.getBucketName());
    const command = new GetObjectCommand({
      Bucket: this.getBucketName(),
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  }


  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.getBucketName(),
      Key: key,
    });

    await this.s3Client.send(command);
  }


  create(createAwsS3Dto: CreateAwsS3Dto) {
    return 'This action adds a new awsS3';
  }



  findAll() {
    return `This action returns all awsS3`;
  }

  findOne(id: number) {
    return `This action returns a #${id} awsS3`;
  }

  update(id: number, updateAwsS3Dto: UpdateAwsS3Dto) {
    return `This action updates a #${id} awsS3`;
  }

  remove(id: number) {
    return `This action removes a #${id} awsS3`;
  }
}
