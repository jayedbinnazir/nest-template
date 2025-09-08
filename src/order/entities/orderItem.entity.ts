import { Entity, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @RelationId((item: OrderItem) => item.order)
  order_id: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @RelationId((item: OrderItem) => item.product)
  product_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtOrder: number; // snapshot at checkout
}
