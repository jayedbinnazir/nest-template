import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductCategoryService } from '../services/product-category.service';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto';
import { CreateProductDto } from 'src/product/dto/create-product.dto';


@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  // @Post()
  // create(@Body() CreateProductDto: CreateProductDto , categoryId: string) {
  //   return this.productCategoryService.createProductCategory(CreateProductDto ,categoryId );
  // }
  @Post("create")
  async create(@Body() createProductDto: CreateProductCategoryDto ) {
    return await this.productCategoryService.createProductCategory(createProductDto);
  }

  @Get()
  findAll() {
    return this.productCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.productCategoryService.update(+id, updateProductCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(+id);
  }
}
