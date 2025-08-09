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
  UseGuards,
  Request,
  BadRequestException,
  ParseUUIDPipe
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../services/files.service';
import { UpdateFileDto } from '../dto/update-file.dto';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // // Upload single file
  // @Post('upload/single')
  // @UseGuards(JwtCookieGuard)
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadSingle(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Query('category') category: string = 'temp',
  //   @Query('description') description: string,
  //   @Request() req: any
  // ) {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }

  //   // Validate category
  //   if (!Object.values(FileCategory).includes(category as FileCategory)) {
  //     throw new BadRequestException(`Invalid category. Allowed: ${Object.values(FileCategory).join(', ')}`);
  //   }

  //   const savedFile = await this.filesService.saveFileRecord(
  //     file,
  //     category as FileCategory,
  //     req.user.id,
  //     description
  //   );

  //   return {
  //     message: 'File uploaded successfully',
  //     file: {
  //       id: savedFile.id,
  //       originalName: savedFile.originalName,
  //       filename: savedFile.filename,
  //       category: savedFile.category,
  //       size: savedFile.size,
  //       mimetype: savedFile.mimetype,
  //       publicUrl: savedFile.publicUrl,
  //       description: savedFile.description
  //     }
  //   };
  // }

  // // Upload multiple files
  // @Post('upload/multiple')
  // @UseGuards(JwtCookieGuard)
  // @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  // async uploadMultiple(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Query('category') category: string = 'temp',
  //   @Query('description') description: string,
  //   @Request() req: any
  // ) {
  //   if (!files || files.length === 0) {
  //     throw new BadRequestException('No files uploaded');
  //   }

  //   // Validate category
  //   if (!Object.values(FileCategory).includes(category as FileCategory)) {
  //     throw new BadRequestException(`Invalid category. Allowed: ${Object.values(FileCategory).join(', ')}`);
  //   }

  //   const savedFiles = await this.filesService.saveMultipleFileRecords(
  //     files,
  //     category as FileCategory,
  //     req.user.id,
  //     description
  //   );

  //   return {
  //     message: `${savedFiles.length} files uploaded successfully`,
  //     files: savedFiles.map(file => ({
  //       id: file.id,
  //       originalName: file.originalName,
  //       filename: file.filename,
  //       category: file.category,
  //       size: file.size,
  //       mimetype: file.mimetype,
  //       publicUrl: file.publicUrl,
  //       description: file.description
  //     }))
  //   };
  // }

  // // Upload profile picture (convenience endpoint)
  // @Post('upload/profile')
  // @UseGuards(JwtCookieGuard)
  // @UseInterceptors(FileInterceptor('profile_picture'))
  // async uploadProfilePicture(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Request() req: any
  // ) {
  //   if (!file) {
  //     throw new BadRequestException('No profile picture uploaded');
  //   }

  //   const savedFile = await this.filesService.saveFileRecord(
  //     file,
  //     FileCategory.PROFILE,
  //     req.user.id,
  //     'Profile Picture'
  //   );

  //   return {
  //     message: 'Profile picture uploaded successfully',
  //     profilePicture: {
  //       id: savedFile.id,
  //       filename: savedFile.filename,
  //       publicUrl: savedFile.publicUrl,
  //       size: savedFile.size
  //     }
  //   };
  // }

  // // Get all files for authenticated user
  // @Get('my-files')
  // @UseGuards(JwtCookieGuard)
  // async getMyFiles(
  //   @Query('category') category: string,
  //   @Request() req: any
  // ) {
  //   const fileCategory = category && Object.values(FileCategory).includes(category as FileCategory) 
  //     ? category as FileCategory 
  //     : undefined;

  //   const files = await this.filesService.getUserFiles(req.user.id, fileCategory);
    
  //   return {
  //     files: files.map(file => ({
  //       id: file.id,
  //       originalName: file.originalName,
  //       filename: file.filename,
  //       category: file.category,
  //       size: file.size,
  //       mimetype: file.mimetype,
  //       publicUrl: file.publicUrl,
  //       description: file.description,
  //       created_at: file.created_at
  //     }))
  //   };
  // }

  // // Get user's profile picture
  // @Get('my-profile-picture')
  // @UseGuards(JwtCookieGuard)
  // async getMyProfilePicture(@Request() req: any) {
  //   const profilePicture = await this.filesService.getUserProfilePicture(req.user.id);
    
  //   if (!profilePicture) {
  //     return { message: 'No profile picture found', profilePicture: null };
  //   }

  //   return {
  //     profilePicture: {
  //       id: profilePicture.id,
  //       filename: profilePicture.filename,
  //       publicUrl: profilePicture.publicUrl,
  //       size: profilePicture.size
  //     }
  //   };
  // }

  // // Get all files (admin endpoint)
  // @Get()
  // async findAll(
  //   @Query('category') category: string,
  //   @Query('userId') userId: string
  // ) {
  //   const fileCategory = category && Object.values(FileCategory).includes(category as FileCategory) 
  //     ? category as FileCategory 
  //     : undefined;

  //   return await this.filesService.findAll(userId, fileCategory);
  // }

  // // Get single file by ID
  // @Get(':id')
  // async findOne(@Param('id', ParseUUIDPipe) id: string) {
  //   return await this.filesService.findOne(id);
  // }

  // // Update file metadata
  // @Patch(':id')
  // @UseGuards(JwtCookieGuard)
  // async update(
  //   @Param('id', ParseUUIDPipe) id: string, 
  //   @Body() updateFileDto: UpdateFileDto,
  //   @Request() req: any
  // ) {
  //   // Ensure user can only update their own files
  //   const file = await this.filesService.findOne(id);
  //   if (file.user_id !== req.user.id) {
  //     throw new BadRequestException('You can only update your own files');
  //   }

  //   return await this.filesService.update(id, updateFileDto);
  // }

  // // Delete file
  // @Delete(':id')
  // @UseGuards(JwtCookieGuard)
  // async remove(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Request() req: any
  // ) {
  //   // Ensure user can only delete their own files
  //   const file = await this.filesService.findOne(id);
  //   if (file.user_id !== req.user.id) {
  //     throw new BadRequestException('You can only delete your own files');
  //   }

  //   await this.filesService.remove(id);
  //   return { message: 'File deleted successfully' };
  // }
}
