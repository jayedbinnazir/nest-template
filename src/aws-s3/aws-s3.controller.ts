import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { CreateAwsS3Dto } from './dto/create-aws-s3.dto';
import { UpdateAwsS3Dto } from './dto/update-aws-s3.dto';

@Controller('aws-s3')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Post()
  create(@Body() createAwsS3Dto: CreateAwsS3Dto) {
    return this.awsS3Service.create(createAwsS3Dto);
  }

  @Get("signed-url")
  async getSignedUrl() {
    try {
      return await this.awsS3Service.getSignedUrl("uploads/jayed.jpg");
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get("upload-url")
  async getUploadUrl() {
    try {
      return await this.awsS3Service.uploadFileUrl("jayed.jpg");
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awsS3Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAwsS3Dto: UpdateAwsS3Dto) {
    return this.awsS3Service.update(+id, updateAwsS3Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awsS3Service.remove(+id);
  }
}
