import { BaseEntity } from '../../common/base.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId, Index} from 'typeorm';



@Entity("files")
export class FileUpload extends BaseEntity {

  @Column()
  fieldname: string; // Original name of the file as uploaded by the user

  @Column()
  originalname: string;  //given name of the file after upload

  @Column()
  encoding: string; // Path where the file is stored on the server

  @Column()
  mimetype: string; // MIME type of the file

  @Column({ type: 'bigint' })    
  size: number;  // Size of the file in bytes

  @Column({ default: true })
  isActive: boolean;

  @Column()
  local_url: string; // Local path for the file storage

  // URL path for serving the file
  @Column({ type:"varchar" ,nullable: true })
  public_url: string | null;

  @ManyToOne(() => User, (user) => user.files, {
    onDelete: 'CASCADE',
    nullable: true, // Files can exist without a specific user (for public files)
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  @RelationId((file: FileUpload) => file.user)
  user_id: string;
}