import { Module } from '@nestjs/common';
import { CategoryProductsController } from './controllers/category_products.controller';
import { CategoryProductsService } from './services/category_products.service';


@Module({
  controllers: [CategoryProductsController],
  providers: [CategoryProductsService],
})
export class CategoryProductsModule {}
