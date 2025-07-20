import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';
import { AppUser } from '../../app_user/entities/app_user.entity';
import { FileUpload } from '../../file-upload/entities/file-upload.entity';

@Entity('user_file')
@Unique(['user', 'file'])
export class UserFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AppUser, (user) => user.userFiles, { onDelete: 'CASCADE' })
  user: AppUser;

  @ManyToOne(() => FileUpload, (file) => file.userFiles, { onDelete: 'CASCADE' })
  file: FileUpload;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role: string; // e.g., 'owner', 'viewer', etc.

  @Column({ type: 'boolean', default: false })
  isFavorite: boolean;

  @Column({ type: 'json', nullable: true })
  meta: any; // extensible for tags, notes, etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
