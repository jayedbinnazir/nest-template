import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from '../entities/product-category.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProductService } from '../../product/services/product.service';
import { CategoryService } from 'src/category/services/category.service';
import { CreateProductDto } from 'src/product/dto/create-product.dto';


@Injectable()
export class ProductCategoryService {

  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) { }

  // async createProductCategory(createProductDto: CreateProductDto, categoryId: string) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   queryRunner.connect();
  //   queryRunner.startTransaction();

  //   try {
  //     const product = await this.productService.createProduct(createProductDto, queryRunner.manager);

  //     if (!product) {
  //       throw new Error('Product creation failed');
  //     }

  //     const category = await this.categoryService.findOneCategory(categoryId);

  //     if (!category) {
  //       throw new Error(`Category with ID ${categoryId} not found`);
  //     }

  //     const productCategory = this.productCategoryRepository.create({
  //       product: { id: product.id },
  //       category: { id: category.id }
  //     });

  //     const savedProduct =  await queryRunner.manager.save(productCategory);


  //     const result  =  await queryRunner.manager.getTreeRepository(ProductCategory)
  //                            .createQueryBuilder('pc')
  //                            .leftJoinAndSelect('pc.product', 'product')
  //                            .leftJoin('pc.category', 'category')
  //                            .addSelect([
  //                               "category.id",
  //                               "category.name",
  //                            ])
  //                            .where('pc.id = :id', { id: savedProduct.id })
  //                            .getOne();

  //     await queryRunner.commitTransaction();

  //     return result;

  //   } catch (error) {
  //     queryRunner.rollbackTransaction();
  //     throw new Error(`Failed to create product category: ${error.message}`);
  //   } finally {
  //     await queryRunner.release();
  //   }

  // }


  async createProductCategory(createProductCategoryDto: CreateProductCategoryDto, manager?: EntityManager) {
    const productCategoryRepo = manager ? manager.getRepository(ProductCategory) : this.productCategoryRepository;
    try {
      if (!createProductCategoryDto.product_id || !createProductCategoryDto.category_id) {
        throw new Error('product_id and category_id are required');
      }
      const productCategory = productCategoryRepo.create({
        product: { id: createProductCategoryDto.product_id },
        category: { id: createProductCategoryDto.category_id }
      });
      const result = await productCategoryRepo.save(productCategory);
      const fullProductCategory = await productCategoryRepo.createQueryBuilder('pc')
        .leftJoin('pc.product', 'product')
        .leftJoin('pc.category', 'category')
        .addSelect([
          'product.id', 
          'product.name',
          'category.id', 
          'category.name',
          'category.description'
        ])
        .where('pc.id = :id', { id: result.id })
        .getOne();

       

      console.log('Fully loaded product category:', fullProductCategory);

      return fullProductCategory;
    } catch (error) {
      console.error('Error creating product category:', error);
      throw new Error(`Error creating product category: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.productCategoryRepository.find({
        relations: ['product', 'category'],

      });
    } catch (error) {
      console.error('Error finding all product categories:', error);
      throw new Error(`Error finding all product categories: ${error.message}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} productCategory`;
  }

  update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    return `This action updates a #${id} productCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
}
