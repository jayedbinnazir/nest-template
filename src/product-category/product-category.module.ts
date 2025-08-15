import { Module } from '@nestjs/common';
import { ProductCategoryController } from './controllers/product-category.controller';
import { ProductCategoryService } from './services/product-category.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from 'src/category/category.module';


@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
