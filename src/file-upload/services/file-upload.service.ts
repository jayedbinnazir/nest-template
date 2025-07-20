import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FileUpload, FileType, StorageProvider } from "../entities/file-upload.entity"
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileUploadDto } from '../dto/create-file-upload.dto';
import { UpdateFileUploadDto } from '../dto/update-file-upload.dto';
import { FileUploadResponseDto, FileUploadListResponseDto } from '../dto/file-upload-response.dto';
import { FileUtils } from '../utils/file-utils';
import { UserFileService } from "src/user_file/services/user_file.service";

@Injectable()
export class FileUploadService {
    constructor(
        @InjectRepository(FileUpload)
        private readonly fileRepository: Repository<FileUpload>,
        private readonly userFileService: UserFileService,
    ) {}

    async create(file: Express.Multer.File, dto: CreateFileUploadDto): Promise<FileUploadResponseDto> {
        // Prepare file entity
        const fileEntity = this.fileRepository.create({
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            extension: FileUtils.getFileExtension(file.originalname),
            fileType: FileUtils.getFileType(file.mimetype),
            isPublic: dto.isPublic ?? false,
            url: dto.url ?? '',
            storageProvider: dto.storageProvider ?? StorageProvider.LOCAL,
            storageMeta: dto.storageMeta ?? {},
        });
        const savedFile = await this.fileRepository.save(fileEntity);
        return this.toResponseDto(savedFile);
    }

    async findAll(page = 1, limit = 10, search?: string, fileType?: FileType, uploadedBy?: string): Promise<FileUploadListResponseDto> {
        const qb = this.fileRepository.createQueryBuilder('file');
        if (search) {
            qb.andWhere('file.originalName ILIKE :search', { search: `%${search}%` });
        }
        if (fileType) {
            qb.andWhere('file.fileType = :fileType', { fileType });
        }
        if (uploadedBy) {
            qb.innerJoin('file.userFiles', 'userFile', 'userFile.user = :uploadedBy', { uploadedBy });
        }
        qb.skip((page - 1) * limit).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return { items: items.map(this.toResponseDto), total, page, limit };
    }

    async findOne(id: string): Promise<FileUploadResponseDto> {
        const file = await this.fileRepository.findOne({ where: { id } });
        if (!file) throw new NotFoundException('File not found');
        return this.toResponseDto(file);
    }

    async update(id: string, dto: UpdateFileUploadDto): Promise<FileUploadResponseDto> {
        const file = await this.fileRepository.findOne({ where: { id } });
        if (!file) throw new NotFoundException('File not found');
        Object.assign(file, dto);
        const updated = await this.fileRepository.save(file);
        return this.toResponseDto(updated);
    }

    async remove(id: string): Promise<void> {
        await this.fileRepository.softDelete(id);
    }

    async getPublicFiles(page = 1, limit = 10): Promise<FileUploadListResponseDto> {
        const [items, total] = await this.fileRepository.findAndCount({
            where: { isPublic: true },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items: items.map(this.toResponseDto), total, page, limit };
    }

    async findMediaFiles(page = 1, limit = 10, search?: string): Promise<FileUploadListResponseDto> {
        const qb = this.fileRepository.createQueryBuilder('file')
            .where('file.fileType IN (:...types)', { types: [FileType.VIDEO, FileType.AUDIO] });
        if (search) {
            qb.andWhere('file.originalName ILIKE :search', { search: `%${search}%` });
        }
        qb.skip((page - 1) * limit).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return { items: items.map(this.toResponseDto), total, page, limit };
    }



    private toResponseDto(file: FileUpload): FileUploadResponseDto {
        return {
            id: file.id,
            originalName: file.originalName,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            extension: file.extension,
            fileType: file.fileType,
            isPublic: file.isPublic,
            url: file.url,
            storageProvider: file.storageProvider,
            storageMeta: file.storageMeta,
            uploadedAt: file.uploadedAt,
            updatedAt: file.updatedAt,
            deletedAt: file.deletedAt,
        };
    }
}
