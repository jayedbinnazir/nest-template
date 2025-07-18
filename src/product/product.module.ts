import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';

@Module({
  imports:[TypeOrmModule.forFeature([Product  , Category])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
