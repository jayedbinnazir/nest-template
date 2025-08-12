import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { MulterConfigService } from './multer.config.service';
import { FileUpload } from '../entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileUpload)
    private readonly fileRepository: Repository<FileUpload>,
    private readonly configService: ConfigService,
    private readonly multerConfigService: MulterConfigService,
  ) {}

  async saveFileRecord(file:Express.Multer.File , userId?:string , productId?:string , manager?:EntityManager): Promise<FileUpload> {
    console.log("file service called with file:", file);
    console.log({
      userId,
      productId,
      filePath: file?.path,
    })
    try {

      const repo = manager ? manager.getRepository(FileUpload) : this.fileRepository;

      console.log('File to save:', file);

      if (!file) {
        console.log('No file provided for upload');
        throw new BadRequestException('No file provided for upload');
      }

      console.log("-------user id", userId);
      
      const fileDto:CreateFileDto = {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        size: file.size,
        isActive: true,
        local_url: file.path,
         // Assuming user is an object with at least an id property
        public_url: null, // Set to null initially, can be updated later
      }
      
      // Create the file entity from DTO
      const fileEntity = repo.create({
        ...fileDto,
        user: {id:userId} , // This sets the user relationship, which automatically populates user_id via @RelationId
        product: {id: productId} // This sets the product relationship, which automatically populates product_id via @RelationId
      });
      
      
      const savedFile = await repo.save(fileEntity);
      console.log("Saved file with user_id:", savedFile.user_id);
      
      return savedFile;
    } catch (error) {
      // Only attempt to delete file if the file and path exist
      if (file?.path) {
        await this.multerConfigService.removeFile(file.path);
      }
      throw new BadRequestException(`Failed to save file record: ${error.message}`);
    }
  }

  // async saveMultipleFileRecords(
  //   files: Express.Multer.File[],
  //   category: FileCategory,
  //   userId?: string,
  //   description?: string
  // ): Promise<File[]> {
  //   const savedFiles: File[] = [];
    
  //   for (const file of files) {
  //     const savedFile = await this.saveFileRecord(file, category, userId, description);
  //     savedFiles.push(savedFile);
  //   }
    
  //   return savedFiles;
  // }

  // async findAll(userId?: string, category?: FileCategory): Promise<File[]> {
  //   const query = this.fileRepository.createQueryBuilder('file')
  //     .where('file.isActive = :isActive', { isActive: true });

  //   if (userId) {
  //     query.andWhere('file.user_id = :userId', { userId });
  //   }

  //   if (category) {
  //     query.andWhere('file.category = :category', { category });
  //   }

  //   return await query.getMany();
  // }

  // async findOne(id: string): Promise<File> {
  //   const file = await this.fileRepository.findOne({
  //     where: { id, isActive: true },
  //     relations: ['user']
  //   });

  //   if (!file) {
  //     throw new NotFoundException(`File with ID ${id} not found`);
  //   }

  //   return file;
  // }

  // async update(id: string, updateFileDto: UpdateFileDto): Promise<File> {
  //   const file = await this.findOne(id);
    
  //   Object.assign(file, updateFileDto);
    
  //   return await this.fileRepository.save(file);
  // }

  // async remove(id: string): Promise<void> {
  //   const file = await this.findOne(id);
    
  //   // Soft delete in database
  //   file.isActive = false;
  //   await this.fileRepository.save(file);
    
  //   // Optionally delete physical file
  //   if (existsSync(file.filePath)) {
  //     try {
  //       unlinkSync(file.filePath);
  //     } catch (error) {
  //       console.error(`Failed to delete physical file: ${error.message}`);
  //     }
  //   }
  // }

  // async getUserFiles(userId: string, category?: FileCategory): Promise<File[]> {
  //   return this.findAll(userId, category);
  // }

  // async getUserProfilePicture(userId: string): Promise<File | null> {
  //   const files = await this.findAll(userId, FileCategory.PROFILE);
  //   return files[0] || null;
  // }

  // create(createFileDto: CreateFileDto) {
  //   return 'Use upload endpoints instead';
  // }
}
