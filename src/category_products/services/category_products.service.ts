import { Injectable } from '@nestjs/common';
import { CreateCategoryProductDto } from '../dto/create-category_product.dto';
import { UpdateCategoryProductDto } from '../dto/update-category_product.dto';


@Injectable()
export class CategoryProductsService {
  create(createCategoryProductDto: CreateCategoryProductDto) {
    return 'This action adds a new categoryProduct';
  }

  findAll() {
    return `This action returns all categoryProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryProduct`;
  }

  update(id: number, updateCategoryProductDto: UpdateCategoryProductDto) {
    return `This action updates a #${id} categoryProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryProduct`;
  }
}
