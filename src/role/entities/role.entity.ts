import { UserRole } from '../../user_role/entities/user_role.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Unique,
  OneToMany,
} from 'typeorm';

@Index(['name']) // Optional but helpful if you're querying roles by name
@Unique(['name']) // Enforce uniqueness (e.g., ADMIN, USER)
@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, name: 'description' })
  description: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role, {
    cascade: ['remove' , 'soft-remove'], // Usually false, unless you want Role to control UserRole lifecycle
    eager: true,
  })
  userRoles: UserRole[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}
