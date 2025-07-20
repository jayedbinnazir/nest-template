import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  UseFilters,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileUploadService } from '../services/file-upload.service';
import { CreateFileUploadDto } from '../dto/create-file-upload.dto';
import { UpdateFileUploadDto } from '../dto/update-file-upload.dto';
import { FileUploadResponseDto, FileUploadListResponseDto } from '../dto/file-upload-response.dto';
import { FileType } from '../entities/file-upload.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../app_user/guard/user.guard';
import { Roles } from '../../app_user/decorators/roles.decorator';
import { FileUploadExceptionFilter } from '../filters/file-upload-exception.filter';

@Controller('file-upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(FileUploadExceptionFilter)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileUploadDto: CreateFileUploadDto,
    @Request() req: any,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    return this.fileUploadService.create(
      file,
      createFileUploadDto,
      req.user?.id || req.user?.username,
    );
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileUploadDto: CreateFileUploadDto,
    @Request() req: any,
  ): Promise<FileUploadResponseDto[]> {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    const uploadPromises = files.map(file =>
      this.fileUploadService.create(
        file,
        createFileUploadDto,
        req.user?.id || req.user?.username,
      ),
    );

    return Promise.all(uploadPromises);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('fileType') fileType?: FileType,
    @Query('uploadedBy') uploadedBy?: string,
  ): Promise<FileUploadListResponseDto> {
    return this.fileUploadService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      fileType,
      uploadedBy,
    );
  }

  @Get('public')
  @HttpCode(HttpStatus.OK)
  async getPublicFiles(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<FileUploadListResponseDto> {
    return this.fileUploadService.getPublicFiles(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  // @Get('my-files')
  // @HttpCode(HttpStatus.OK)
  // async getMyFiles(@Request() req: any): Promise<FileUploadResponseDto[]> {
  //   return this.fileUploadService.findByUser(req.user?.id || req.user?.username);
  // }

  @Get('type/:fileType')
  @HttpCode(HttpStatus.OK)
  async getFilesByType(
    @Param('fileType') fileType: FileType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ): Promise<FileUploadListResponseDto> {
    return this.fileUploadService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      fileType,
    );
  }

  @Get('media')
  @HttpCode(HttpStatus.OK)
  async getMediaFiles(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ): Promise<FileUploadListResponseDto> {
    return this.fileUploadService.findMediaFiles(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<FileUploadResponseDto> {
    return this.fileUploadService.findOne(id);
  }

  @Get(':id/download')
  @HttpCode(HttpStatus.OK)
  async downloadFile(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const fileUpload = await this.fileUploadService.findOne(id);
    
    res.download(fileUpload.path, fileUpload.originalName);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateFileUploadDto: UpdateFileUploadDto,
  ): Promise<FileUploadResponseDto> {
    return this.fileUploadService.update(id, updateFileUploadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    return this.fileUploadService.remove(id);
  }

  @Delete('my-files/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMyFile(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    const fileUpload = await this.fileUploadService.findOne(id);
    
    // Check if the file belongs to the current user
    if (fileUpload.uploadedBy !== (req.user?.id || req.user?.username)) {
      throw new Error('You can only delete your own files');
    }
    
    return this.fileUploadService.remove(id);
  }
}