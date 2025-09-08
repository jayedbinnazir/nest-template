import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItems } from './entities/cart_item.entity';
import { ProductModule } from '../product/product.module';
import { Product } from '../product/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cart , CartItems ,Product]) ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
