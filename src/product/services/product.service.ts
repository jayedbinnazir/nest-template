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
import { ProductQueryDto } from '../dto/productQuery.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly productCategoryService: ProductCategoryService,
    private readonly fileService: FilesService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    manager?: EntityManager,
  ) {
    const queryRunner = manager
      ? undefined
      : this.dataSource.createQueryRunner();
    const em = manager ?? queryRunner!.manager;

    if (!manager) {
      await queryRunner!.connect();
      await queryRunner!.startTransaction();
    }

    console.log('create product service called');
    console.log('createProductDto in service', createProductDto);
    try {
      const { user_id, category_id, product_images, ...data } =
        createProductDto;

      // First, verify category exists outside of entity creation
      const categoryRepo = em.getRepository(Category);
      const category = await categoryRepo.findOne({
        where: { id: category_id },
      });
      if (!category)
        throw new Error(`Category with ID ${category_id} not found`);
      console.log('category in service', category);

      // Create product with direct category_id reference
      const productRepo = em.getRepository(Product);
      const product = productRepo.create({
        ...data,
        user: { id: user_id }, // Use direct user_id instead of user object // Handle file upload if provided
      });
      const savedProduct = await productRepo.save(product);
      if (!savedProduct) {
        throw new Error('Product creation failed');
      }
      console.log('savedProduct in service', savedProduct);

      // Handle multiple file uploads - UPDATED THIS SECTION
      if (product_images && product_images.length > 0) {
        // Use the dedicated multiple files method
        await this.fileService.saveMultipleFileRecords(
          product_images,
          user_id,
          savedProduct.id,
          em,
        );
      }

      // Create product category relationship
      const productCategory =
        await this.productCategoryService.createProductCategory(
          {
            product_id: savedProduct.id,
            category_id: category.id,
          },
          em,
        );

      console.log('Product category created------->', productCategory);

      if (!productCategory) {
        throw new Error('Product category creation failed');
      }

      if (!manager) {
        await queryRunner!.commitTransaction();
      }

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
      if (!manager) {
        await queryRunner!.rollbackTransaction();
      }
      throw new Error(`Failed to create product: ${error.message}`);
    } finally {
      if (!manager) {
        await queryRunner!.release();
      }
    }
  }
  
  async findAllProduct(options?: ProductQueryDto) {
    const {
      filter,
      sortBy,
      order,
      search,
      page = 1,
      limit = 10,
    } = options || {};
    console.log('filter in findAllProduct', filter);
    try {
      const query = this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.user', 'user')
        .leftJoin('product.product_images', 'images')
        .leftJoin('product.product_category', 'pc')
        .leftJoin('pc.category', 'category')
        .select([
          'product',
          'images.id',
          'images.local_url',
          'images.public_url',
          'user.id',
          'pc.id',
          'category.id',
          'category.name',
          'category.description',
        ]);

      // 🔎 Full-text search
      if (search) {
        query.andWhere(
          `to_tsvector('english', product.name || ' ' || product.description || ' ' || product.brand || ' ' || product.importedFrom || ' ' || COALESCE(category.name, '') || ' ' || COALESCE(category.description, '') ) @@ plainto_tsquery('english', :search )`,
          { search },
        );
      }

      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'categoryId') {
              query.andWhere('category.id = :categoryId', {
                categoryId: value,
              });
            } else if (key === 'categoryName') {
              query.andWhere('category.name ILIKE :categoryName', {
                categoryName: `%${value}%`, // allows partial match
              });
            } else if (key === 'minPrice') {
              query.andWhere('product.price >= :minPrice', { minPrice: value });
            } else if (key === 'maxPrice') {
              query.andWhere('product.price <= :maxPrice', { maxPrice: value });
            } else {
              query.andWhere(`product.${key} = :${key}`, { [key]: value });
            }
          }
        });
      }

      // Sorting
      if (sortBy) {
        query.orderBy(`product.${sortBy}`, order ?? 'ASC'); // default ASC
      }

      // 📌 Pagination
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);

      // Execute query
      const [data, total] = await query.getManyAndCount();

      return {
        status: 'success',
        code: 200,
        message: 'Products fetched successfully',
        products: data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to find all products: ${error.message}`);
    }
  }

  async findOneProduct(id: string, withDeleted: boolean = false) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        withDeleted: withDeleted,
      });
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
    const repo = manager
      ? manager.getRepository(Product)
      : this.productRepository;
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
      throw new Error(
        `Failed to soft delete product with ID ${id}: ${error.message}`,
      );
    }
  }

  // Restore a soft deleted product
  async restoreProduct(id: string, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Product)
      : this.productRepository;
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
      throw new Error(
        `Failed to restore product with ID ${id}: ${error.message}`,
      );
    }
  }

  // Permanently delete a product // can delete soft deleted product also
  async hardRemove(id: string, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Product)
      : this.productRepository;
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
      throw new Error(
        `Failed to permanently delete product with ID ${id}: ${error.message}`,
      );
    }
  }
}
