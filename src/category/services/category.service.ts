import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterDeleteProps } from 'src/common/interfaces';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ){}


  async createCategory(createCategoryDto: CreateCategoryDto , manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Category) : this.categoryRepository;
    try {
      const category = repo.create(createCategoryDto);
      return await repo.save(category);
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  async findAllCategory( filterDeleteProps? : FilterDeleteProps) {
    const { withDeleted = false, isDeleted = false } = filterDeleteProps || {};
      try {
        return await this.categoryRepository.find({ withDeleted: withDeleted ,where:{ deleted_at:isDeleted ? IsNull() : IsNull() } });
      } catch (error) {
        throw new Error(`Failed to find all categories: ${error.message}`);
      }
  }

  async categoryfindByName(name: string,filterDeleteProps?: FilterDeleteProps) {
    const { withDeleted = false } = filterDeleteProps || {};
    try {
      const category = await this.categoryRepository.findOne({ where: { name }, withDeleted: withDeleted });
      if (!category) {
        throw new Error(`Category with name ${name} not found`);
      }
      return category;
    } catch (error) {
      throw new Error(`Failed to find category with name ${name}: ${error.message}`);
    }
  }

  findOneCategory(id: string, filterDeleteProps?: FilterDeleteProps) {
    const { withDeleted = false } = filterDeleteProps || {};
    try {
      const category = this.categoryRepository.findOne({ where: { id } , withDeleted: withDeleted });
      if (!category) {
        throw new Error(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      throw new Error(`Failed to find category with ID ${id}: ${error.message}`);
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto , manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Category) : this.categoryRepository;
    try {
      const category = await repo.findOne({where: { id } , withDeleted: true});
      if (!category) {
        throw new Error(`Category with ID ${id} not found`);
      }
      return await repo.save(category);
    } catch (error) {
      throw new Error(`Failed to update category with ID ${id}: ${error.message}`);
    }
  }

  async softRemoveCategory(id: string, manager?: EntityManager) {
    try {
      const repo = manager ? manager.getRepository(Category) : this.categoryRepository;
      const category = await repo.findOne({where:{id}}  );
      if (!category) {
        throw new Error(`Category with ID ${id} not found`);
      }
      await repo.softRemove(category);
      return { message: `Category with ID ${id} ${category.name} soft removed successfully` };
    } catch (error) {
      throw new Error(`Failed to soft remove category with ID ${id}: ${error.message}`);
    }
  }


  async hardRemoveCategory(id: string, manager?: EntityManager) {
    try {
      const repo = manager ? manager.getRepository(Category) : this.categoryRepository;
      const category = await repo.findOne({ where: { id }, withDeleted: true });    
      if (!category) {
        throw new Error(`Category with ID ${id} not found`);
      }
      await repo.remove(category);
      return { message: `Category with ID ${id} ${category.name} hard removed successfully` };
    } catch (error) {
      throw new Error(`Failed to hard remove category with ID ${id}: ${error.message}`);
    }
  }

  async restoreCategory(id: string, manager?: EntityManager) {
    try {
      const repo = manager ? manager.getRepository(Category) : this.categoryRepository;
      const category = await repo.findOne({ where: { id }, withDeleted: true });
      if (!category) {
        throw new Error(`Category with ID ${id} not found`);
      }
      await repo.restore(id);
      return { message: `Category with ID ${id} ${category.name} restored successfully` };
    }
    catch (error) { 
      throw new Error(`Failed to restore category with ID ${id}: ${error.message}`);
    }
  }



}
