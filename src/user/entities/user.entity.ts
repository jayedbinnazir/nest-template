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
import { BaseEntity } from '../../common/base.entity';
import { AppUser } from '../../app_user/entities/app_user.entity';

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
  phone?: string | null = null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string | null = null;

  @OneToMany(() => AppUser, (appUser) => appUser.user, {
    cascade: [ 'soft-remove' , 'insert' ,'recover' , 'remove'], 
    eager: false, 
  })
  appUsers: AppUser[];


//   @OneToMany(() => UserFile, (userFile) => userFile.user, {
//     cascade: ['remove' , 'soft-remove' , 'insert' , 'update' , 'recover'], 
//     eager: false, 
//     lazy: true,
//   })
//   userFiles: Promise<UserFile[]>;


//   @OneToMany(() => Product, product => product.user , {
//     lazy:true,
//     cascade:true
//   })
//   products: Product[];

}
