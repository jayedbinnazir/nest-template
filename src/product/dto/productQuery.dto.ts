import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  Min,
  IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Product } from '../entities/product.entity';

export class ProductQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return value ? JSON.parse(value) : {};
    } catch (err) {
      return {}; // or throw an error if you want
    }
  })
  filter?: Record<keyof Product, any>; // now it's a real object

  @IsOptional()
  @IsIn(['id', 'name', 'price', 'created_at', 'updated_at']) // allowed sortable keys
  sortBy?: keyof Product;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  limit?: number = 10; // default limit

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1; // default page
}
