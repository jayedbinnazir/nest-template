import { AppUser } from '../../app_user/entities/app_user.entity';
import { Role } from '../../role/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, RelationId, Index, Column } from 'typeorm';

@Entity('user_role')
@Index('IDX_USER_ROLE_USER_ID', ['user_id'])
@Index('IDX_USER_ROLE_ROLE_ID', ['role_id'])
@Index('IDX_USER_ROLE_COMPOSITE', ['user_id', 'role_id'], { unique: true })
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @Column({ type: 'uuid', name:'user_id' })
  user_id: string;
  
  @ManyToOne(() => AppUser, (appUser) => appUser.userRoles, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'user_id' , referencedColumnName: 'id' })
  user: Promise<AppUser>;


  @Column({ type: 'uuid', name:'role_id' })
  role_id: string;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'role_id' , referencedColumnName: 'id' })
  role: Promise<Role>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deleted_at: Date | null;
}
