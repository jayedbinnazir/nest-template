import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { EntityManager, Repository, IsNull, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../../category/entities/category.entity';
import { ProductCategoryService } from '../../product-category/services/product-category.service';
import { CreateProductCategoryDto } from 'src/product-category/dto/create-product-category.dto';
import { create } from 'domain';
import { FilesService } from '../../files/services/files.service';


@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly productCategoryService: ProductCategoryService,
    private readonly fileService: FilesService

  ) { }

  async createProduct(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    console.log("create product service called")
    console.log("createProductDto in service", createProductDto);
    try {
      const { user_id, category_id, product_images , ...data } = createProductDto;
      
      // First, verify category exists outside of entity creation
      const categoryRepo = queryRunner.manager.getRepository(Category);
      const category = await categoryRepo.findOne({
        where: { id: category_id }
      });
      if (!category) throw new Error(`Category with ID ${category_id} not found`);
      console.log("category in service", category);

      // Create product with direct category_id reference
      const productRepo = queryRunner.manager.getRepository(Product);
      const product = productRepo.create({
        ...data,
        user: {id:user_id}, // Use direct user_id instead of user object // Handle file upload if provided
        
      });
      const savedProduct = await productRepo.save(product);
      if (!savedProduct) {
        throw new Error('Product creation failed');
      }
      console.log("savedProduct in service", savedProduct);

      // Handle file upload if provided 
                  // File upload is optional during registration
        const newFile = product_images ? await this.fileService.saveFileRecord(product_images, undefined, product.id, queryRunner.manager) : null;
      if (newFile) {
        console.log('File uploaded successfully:', newFile);
      }

      // Create product category relationship
      const productCategory = await this.productCategoryService.createProductCategory(
        {
          product_id: savedProduct.id,
          category_id: category.id
        }, queryRunner.manager
      );

      console.log('Product category created------->', productCategory);

      if (!productCategory) {
        throw new Error('Product category creation failed');
      }

      await queryRunner.commitTransaction();

      // After committing, fetch the complete result with all relations
      const result = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.user', 'user')
        .leftJoin('product.product_images', 'images')
        .leftJoin('product.product_category', 'pc')
        .leftJoin('pc.category', 'category')
        .select([
          'product',
          'images',
          'user.id',
          'user.email',
          'pc.id',
          'category.id',
          'category.name',
          'category.description',
        ])
        .where('product.id = :id', { id: savedProduct.id })
        .getOne();

      return result;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to create product: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }


  //find onlysoft deleted || find all products || find all with deleted
  async findAllProduct(deleted: boolean = false, withDeleted: boolean = false) {
    try {
      return await this.productRepository.find({ where: { deleted_at: deleted ? IsNull() : IsNull() }, withDeleted: withDeleted });
    } catch (error) {
      throw new Error(`Failed to find all products: ${error.message}`);
    }
  }



  async findOneProduct(id: string, withDeleted: boolean = false) {
    try {
      const product = await this.productRepository.findOne({ where: { id }, withDeleted: withDeleted });
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new Error(`Failed to find product with ID ${id}: ${error.message}`);
    }
  }


  // async updateProduct(id: string, updateProductDto: UpdateProductDto, manager?: EntityManager) {
  //   const repo = manager ? manager.getRepository(Product) : this.productRepository;
  //   if (!id) {
  //     throw new Error('Product ID is required for update');
  //   }
  //   try {
  //     const product = await repo.preload({
  //       id: id,
  //       ...updateProductDto,
  //     });
  //     if (!product) {
  //       throw new Error(`Product with ID ${id} not found`);
  //     }
  //     return await repo.save(product);
  //   } catch (error) {
  //     throw new Error(`Failed to update product with ID ${id}: ${error.message}`);
  //   }
  // }


  // Soft delete a product
  async softRemoveemoveProduct(id: string, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Product) : this.productRepository;
    if (!id) {
      throw new Error('Product ID is required for deletion');
    }
    try {
      const product = await repo.findOne({ where: { id } });
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      await repo.softDelete(id);
      return { message: `Product with ID ${id} has been soft deleted` };
    } catch (error) {
      throw new Error(`Failed to soft delete product with ID ${id}: ${error.message}`);
    }
  }

  // Restore a soft deleted product
  async restoreProduct(id: string, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Product) : this.productRepository;
    if (!id) {
      throw new Error('Product ID is required for restoration');
    }
    try {
      const product = await repo.findOne({ where: { id }, withDeleted: true });
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      await repo.restore(id);
      return { message: `Product with ID ${id} has been restored` };
    } catch (error) {
      throw new Error(`Failed to restore product with ID ${id}: ${error.message}`);
    }
  }

  // Permanently delete a product // can delete soft deleted product also
  async hardRemove(id: string, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Product) : this.productRepository;
    if (!id) {
      throw new Error('Product ID is required for permanent deletion');
    }
    try {
      const product = await repo.findOne({ where: { id }, withDeleted: true });
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      await repo.delete(id);
      return { message: `Product with ID ${id} has been permanently deleted` };
    } catch (error) {
      throw new Error(`Failed to permanently delete product with ID ${id}: ${error.message}`);
    }
  }
}
