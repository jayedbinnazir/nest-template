import { Controller, Post, Body, Get, Param, Put, UseGuards, Req } from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../../auth/guards/jwt-cookie-optional.guard';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { JwtCookieGuard } from '../../auth/guards/jwt-cookie.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // =========================
  // Place Order (guest or logged in)
  // =========================
  @UseGuards(OptionalJwtAuthGuard)
  @Post('checkout')
  async placeOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.cookies.session_id;
    if (userId){
      createOrderDto.userId = userId;
    } else if (sessionId) {
      createOrderDto.sessionId = sessionId;
    }
    try {

      return await this.orderService.placeOrder(createOrderDto);

    }catch (err) {
      console.error("Error in placeOrder:", err);
      throw err;
    }
  }

  // =========================
  // Get a single order by ID
  // =========================
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    try {
      return await this.orderService.getOrderById(orderId);
    }catch (err) {
      console.error("Error in getOrder:", err);
      throw err;
    }
  }

  // =========================
  // Update order status (admin)
  // =========================
  @UseGuards(JwtCookieGuard) // Only authenticated (maybe admin) can update status
  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
   try {
      return await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
   } catch (err) {
      console.error("Error in updateOrderStatus:", err);
      throw err;
   }
  }

  // =========================
  // Get all orders of logged-in user
  // =========================
  @UseGuards(JwtCookieGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req) {
    const userId = req.user.id;
    try {
      return await this.orderService.getOrdersByUser(userId);
    } catch (err) {
      console.error("Error in getMyOrders:", err);
      throw err;
    }
  }
}
