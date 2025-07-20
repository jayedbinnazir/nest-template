import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { UserFile } from '../../user_file/entities/user_file.entity';

export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

export enum StorageProvider {
  LOCAL = 'local',
  S3 = 's3',
  CLOUDINARY='cloudinary'
}

@Entity('file_upload')
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Column({ type: 'varchar', length: 100 })
  mimetype: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'varchar', length: 10 })
  extension: string;

  @Column({
    type: 'enum',
    enum: FileType,
    default: FileType.OTHER,
  })
  fileType: FileType;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({
    type: 'enum',
    enum: StorageProvider,
    default: StorageProvider.LOCAL,
  })
  storageProvider: StorageProvider;

  @Column({ type: 'json', nullable: true })
  storageMeta: any; // e.g., S3 bucket/key, or local disk info

  @OneToMany(() => UserFile, (userFile) => userFile.file, {
    cascade: ['remove', 'soft-remove', 'insert', 'update', 'recover'],
    eager: false,
    lazy: true,
  })
  userFiles: Promise<UserFile[]>;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
