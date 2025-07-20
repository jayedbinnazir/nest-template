import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Unique,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../user_role/entities/user_role.entity';
import { UserFile } from '../../user_file/entities/user_file.entity';

@Entity('app_user')
@Index(['email']) // Index for email lookups
@Unique(['email']) // Ensure email uniqueness
export class AppUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30, nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: false, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'password' })
  @Exclude() // Exclude password from responses
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default:null, name: 'phone' })
  phone?: string | null = null;

  @Column({ type: 'varchar', length: 500, nullable: true, default:null, name: 'address' })
  address?: string | null = null;

  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    cascade: ['remove' , 'soft-remove'], 
    eager: true, 
  })
  userRoles: UserRole[];


  @OneToMany(() => UserFile, (userFile) => userFile.user, {
    cascade: ['remove' , 'soft-remove' , 'insert' , 'update' , 'recover'], 
    eager: false, 
    lazy: true,
  })
  userFiles: Promise<UserFile[]>;

  //Dtae Related columns
  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: false,
    name: 'updated_at',
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
    name: 'deleted_at',
  })
  deleted_at: Date | null;
}
