import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
