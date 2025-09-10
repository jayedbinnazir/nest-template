import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string; // Registered user

  @IsOptional()
  @IsString()
  sessionId?: string; // Guest user

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
