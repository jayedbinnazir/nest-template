import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { MulterConfigService } from './multer.config.service';
import { FileUser } from '../entities/file.user.entity';
import { runInTransaction } from 'src/utils/transaction.util';

@Injectable()
export class FilesUserService {
  constructor(
    @InjectRepository(FileUser)
    private readonly fileUserRepository: Repository<FileUser>,
    private readonly configService: ConfigService,
    private readonly multerConfigService: MulterConfigService,
    private readonly dataSource: DataSource
  ) { }

  async saveMultipleFileUserRecords(files: Express.Multer.File[], userId?: string, manager?: EntityManager): Promise<FileUser[]> {

    return runInTransaction(this.dataSource, async (em) => {
      const repo = manager ? em.getRepository(FileUser) : this.fileUserRepository;
      console.log('File to save:', files);

      if (!files || files.length === 0) {
        console.log('No file provided for upload');
        throw new BadRequestException('No file provided for upload');
      }

      console.log("-------user id", userId);

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

        try {

        } catch (error) {

        }

        return repo.create({
          ...fileDto,
          user: { id: userId },
        });
      });

      console.log("fileEntities to be saved:", fileEntities);
      try {

        const savedFiles = await repo.save(fileEntities);

        return savedFiles;

      } catch (error) {
        // Clean up files if save fails
        await Promise.all(files.map(file =>
          file.path ? this.multerConfigService.removeFile(file.path) : Promise.resolve()
        ));
        throw new BadRequestException(`Failed to save file records: ${error.message}`);
      }
    }
      , manager)

  }
}