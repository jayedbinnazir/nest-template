import { Entity, Column, ManyToOne, JoinColumn, OneToMany, RelationId } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('product_comments')
export class ProductComment extends BaseEntity {
    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' , referencedColumnName: 'id'})
    product: Product;

    @RelationId((comment: ProductComment) => comment.product)
    product_id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' , nullable: true})
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user?: User | null;

    @RelationId((comment: ProductComment) => comment.user)
    user_id?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    session_id?: string | null; // for guest comments

    @ManyToOne(() => ProductComment, (c) => c.replies, { nullable: true })
    @JoinColumn({ name: 'parent_comment_id' , referencedColumnName: 'id' })
    parentComment?: ProductComment | null;

    @OneToMany(() => ProductComment, (c) => c.parentComment )
    replies?: ProductComment[] | null;

    @Column('text')
    content: string;
}
