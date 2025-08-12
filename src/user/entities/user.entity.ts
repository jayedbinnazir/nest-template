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
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/base.entity';
import { AppUser } from '../../app_user/entities/app_user.entity';
import { FileUpload } from '../../files/entities/file.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('users')
@Index(['email']) // Index for email lookups
@Unique(['email']) // Ensure email uniqueness
export class User extends BaseEntity {

  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @Exclude() // Exclude password from responses
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string | null ;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string | null ;

  @OneToMany(() => AppUser, (appUser) => appUser.user, {
    cascade: [ 'soft-remove' , 'insert' ,'recover' , 'remove'], 
    eager: false, 
  })
  appUsers: AppUser[];

  // Multiple files relationship (replaces the single profile_picture)
  @OneToMany(() => FileUpload, (file) => file.user, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
    eager: false,
    nullable: true,
  })
  profile_picture?: FileUpload[];


  @OneToMany(() => Product, (product) => product.user, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
    eager: false,
    nullable: true,
  })
  products: Product[];
}
