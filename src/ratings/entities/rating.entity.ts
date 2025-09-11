import { Entity, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

@Entity('product_ratings')
export class ProductRating extends BaseEntity {
    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    product: Product;

    @RelationId((rating: ProductRating) => rating.product)
    product_id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @RelationId((rating: ProductRating) => rating.user)
    user_id: string;


    @Column({ type: 'varchar', length: 255, nullable: true })
    session_id: string | null; // For anonymous users

    @Column('decimal', { precision: 2, scale: 1 })
    rating: number; // e.g. 4.5

}
