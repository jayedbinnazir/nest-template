import { AppUser } from '../../app_user/entities/app_user.entity';
import { BaseEntity } from '../../common/base.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  Index,
  Unique,
  OneToMany,
} from 'typeorm';

@Index(['name']) // Optional but helpful if you're querying roles by name
@Unique(['name']) // Enforce uniqueness (e.g., ADMIN, USER)
@Entity('role')
export class Role extends BaseEntity {

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  description: string;

  @OneToMany(() => AppUser, (appUser) => appUser.role, {
    cascade: ['soft-remove' , 'insert' , 'recover' ],
    lazy:true // Usually false, unless you want Role to control AppUser lifecycle
  })
  appUsers: Promise<AppUser[]>;

}
