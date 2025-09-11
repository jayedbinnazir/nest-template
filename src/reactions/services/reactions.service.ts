import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { ProductReaction } from '../entities/reaction.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateReactionDto } from '../dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(ProductReaction)
    private readonly reactionRepo: Repository<ProductReaction>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) { }

  // Create or update reaction
  async createOrUpdateReaction(
    createReactionDto: CreateReactionDto,
    manager?: EntityManager,
  ): Promise<ProductReaction | null> {
    const queryRunner = manager ? undefined : this.datasource.createQueryRunner();
    const em = manager ?? queryRunner!.manager;

    if (!manager) {
      await queryRunner?.connect();
      await queryRunner?.startTransaction();
    }

    const { product_id, user_id, session_id, type } = createReactionDto;

    try {

      // 1. Check if product exists
      const product = await em.findOne(Product, { where: { id: product_id } });
      if (!product) throw new NotFoundException('Product not found');

      // 2. Check if reaction already exists (user OR session)
      let existingReaction: ProductReaction | null = null;
      if (user_id) {
        existingReaction = await em.findOne(ProductReaction, { where: { product: { id: product_id }, user: { id: user_id } } });
      } else if (session_id) {
        existingReaction = await em.findOne(ProductReaction, { where: { product: { id: product_id }, session_id } });
      }

      if (existingReaction) {
        // If same type → toggle off (remove reaction)
        if (existingReaction.type === type) {
          await em.remove(ProductReaction, existingReaction);
          return null;
        }

        // Else update to new type
        existingReaction.type = type;
        const updateReaction = await em.save(ProductReaction, existingReaction);
        if (!manager) await queryRunner!.commitTransaction();
        return updateReaction;
      }

      // 3. Create new reaction
      const newReaction = this.reactionRepo.create({
        product,
        user: user_id ? { id: user_id } as any : null,
        session_id: session_id || null,
        type,
      });

      const savedReaction = await em.save(ProductReaction, newReaction);
      if (!manager) await queryRunner!.commitTransaction();
      return savedReaction;

    } catch (err) {
      if (!manager) await queryRunner!.rollbackTransaction();
      throw err;
    } finally {
      if (!manager) await queryRunner!.release();
    }
  }

  // Get reactions summary for a product
  async getReactionsSummary(productId: string) {
    try {

      const product = await this.productRepo.findOne({ where: { id: productId } });
      if (!product) throw new NotFoundException('Product not found');

      const reactions = await this.reactionRepo
        .createQueryBuilder('reaction')
        .select('reaction.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where('reaction.product_id = :productId', { productId })
        .groupBy('reaction.type')
        .getRawMany();

      return reactions;

    } catch (err) {
      throw err
    }
  }
}
