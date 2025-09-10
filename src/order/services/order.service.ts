import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Product } from '../../product/entities/product.entity';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    private dataSource: DataSource,
  ) { }

  // Place an order
  async placeOrder(dto: CreateOrderDto, manager?: EntityManager): Promise<Order> {
    const queryRunner = manager ? undefined : this.dataSource.createQueryRunner();
    const em = manager ?? queryRunner!.manager;

    if (!manager) {
      await queryRunner!.connect();
      await queryRunner!.startTransaction();
    }

    try {
      // Create Order
      const order = this.orderRepository.create({
        user: dto.userId ? { id: dto.userId } as any : undefined,
        session_id: dto.sessionId || undefined,
        shipping_address: dto.shippingAddress,
        payment_method: dto.paymentMethod,
        status: OrderStatus.PENDING,
        total_amount: 0, // will update later
      });

      await em.save(order);

      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of dto.items) {
        const product = await em.findOne(Product, { where: { id: itemDto.productId } });
        if (!product) throw new NotFoundException(`Product not found: ${itemDto.productId}`);

        const orderItem = this.orderItemRepository.create({
          order: { id: order.id },
          product: { id: product.id },
          quantity: itemDto.quantity,
          priceAtOrder: Number(product.price), // snapshot at checkout
        });

        total += Number(product.price) * itemDto.quantity;
        orderItems.push(orderItem);
      }

      await em.save(orderItems);

      order.total_amount = total;
      await em.save(order);

      if (!manager) await queryRunner!.commitTransaction();
      return order;
    } catch (error) {
      if (!manager) await queryRunner!.rollbackTransaction();
      throw error;
    } finally {
      if (!manager) await queryRunner!.release();
    }
  }


  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['items', 'items.product'],
      });
      if (!order) throw new NotFoundException('Order not found');
      return order;
    }
    catch (error) {
      console.error("Error in getOrderById:", error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId);
      order.status = dto.status;
      return this.orderRepository.save(order);
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      throw error;
    }
  }

  // List orders for a user
  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      return this.orderRepository.find({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      console.error("Error in getOrdersByUser:", error);
      throw error;
    }
  }
}
