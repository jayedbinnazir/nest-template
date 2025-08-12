import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Filter } from 'typeorm';
import { FilterDeleteProps } from '../../common/interfaces';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("create")
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get("all")
  async findAll(@Body() body:FilterDeleteProps) {
    return await this.categoryService.findAllCategory(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string , @Body() body: FilterDeleteProps) {
    return await this.categoryService.findOneCategory(id , body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  softRemove(@Param('id') id: string) {
    return this.categoryService.softRemoveCategory(id);
  }

  @Delete(':id')
  hardRemove(@Param('id') id: string) {
    return this.categoryService.hardRemoveCategory(id);
  }
}
