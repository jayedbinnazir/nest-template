import { Entity, Column, ManyToOne, OneToMany, JoinColumn, RelationId } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './orderItem.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  SSLCOMMERZ = 'sslcommerz',
  COD = 'cod',
  BKASH = 'bkash',
  NAGAD = 'nagad',
}

@Entity('orders')
export class Order extends BaseEntity {
  @ManyToOne(() => User, (user) => user, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User | null;

  @RelationId((order: Order) => order.user)
  user_id: string;

  @Column({ type: 'varchar', nullable: true })
  session_id?: string | null; // for guest orders

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shipping_address?: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  payment_method?: PaymentMethod;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert'],
  })
  items: OrderItem[];
}

