import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateFileDto } from '../dto/create-file.dto';
import { MulterConfigService } from './multer.config.service';
import { FileProduct } from '../entities/file.product.entity';

@Injectable()
export class FilesProductService {
  constructor(
    @InjectRepository(FileProduct)
    private readonly fileProductRepository: Repository<FileProduct>,
    private readonly configService: ConfigService,
    private readonly multerConfigService: MulterConfigService,
  ) { }

  async saveMultipleFileProductRecords(files: Express.Multer.File[], productId?: string, manager?: EntityManager): Promise<FileProduct[]> {
    console.log("file user service called with file:", files);
    console.log({
      productId,
      filePath: files.map(file => file.path),
    })
    try {

      const repo = manager ? manager.getRepository(FileProduct) : this.fileProductRepository;

      console.log('File to save:', files);

      if (!files || files.length === 0) {
        console.log('No file provided for upload');
        throw new BadRequestException('No file provided for upload');
      }

      console.log("-------user id", productId);

      const fileEntities = files.map(file => {
        const fileDto: CreateFileDto = {
          fieldname: file.fieldname,
          originalname: file.originalname,
          encoding: file.encoding,
          mimetype: file.mimetype,
          size: file.size,
          isActive: true,
          local_url: file.path,
          public_url: null,
        };

        return repo.create({
          ...fileDto,
          product: { id: productId },
        });
      });

      console.log("fileEntities to be saved:", fileEntities);
      const savedFiles =  await repo.save(fileEntities);
      return savedFiles;
      
    } catch (error) {
      // Only attempt to delete file if the file and path exist
      await Promise.all(files.map(file =>
        file.path ? this.multerConfigService.removeFile(file.path) : Promise.resolve()
      ));
      throw new BadRequestException(`Failed to save file records: ${error.message}`);
    }
  }

}