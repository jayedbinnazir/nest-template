import { Entity, Column, ManyToOne, JoinColumn, RelationId, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
  DOWN = 'down',
}

@Entity('product_reactions')
@Unique(['product', 'user']) // 1 user can react only once per product
@Unique(['product', 'session_id']) // also handle guests
export class ProductReaction extends BaseEntity {
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @RelationId((reaction: ProductReaction) => reaction.product)
  product_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User | null;

  @RelationId((reaction: ProductReaction) => reaction.user)
  user_id?: string | null;

  @Column({ type: 'varchar', nullable: true })
  session_id?: string | null; // guest reactions

  @Column({
    type: 'enum',
    enum: ReactionType,
  })
  type: ReactionType;
}
