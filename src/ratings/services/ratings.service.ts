import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRating } from '../entities/rating.entity';


@Injectable()
export class RatingsService {

  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(ProductRating)
    private readonly ratingRepository: Repository<ProductRating>
  ) { }
  async rate(createRatingDto: CreateRatingDto, manager?: EntityManager) {

    const { product_id, user_id, session_id, rating } = createRatingDto;
    let queryRunner = manager ? undefined : this.datasource.createQueryRunner()
    let em = manager ?? queryRunner!.manager;

    if (!manager) {
      await queryRunner?.connect()
      await queryRunner?.startTransaction()
    }

    try {

      const product = await em.findOne(ProductRating, { where: { product: { id: product_id } } })

      if (!product) {
        throw new NotFoundException("Product not found")
      }

      const newRating = em.create(ProductRating, {
        product: product_id ? { id: product.id } as any : null,
        user: user_id ? { id: user_id } as any : null,
        session_id: session_id || null,
        rating: rating
      })

      if (!newRating) {
        throw new NotFoundException("Could not create rating")
      }

      await em.save(ProductRating, newRating)
      if (!manager) await queryRunner!.commitTransaction();
      return newRating

    } catch (err) {
      if (!manager) await queryRunner!.rollbackTransaction();
      throw err;
    } finally {
      if (!manager) await queryRunner!.release();
    }
  }

  async updateRating(updateRting: UpdateRatingDto, manager?: EntityManager) {
    const { product_id, user_id, session_id, rating } = updateRting;
    let queryRunner = manager ? undefined : this.datasource.createQueryRunner()
    let em = manager ?? queryRunner!.manager;

    try {

      const existingRating = await em.findOne(ProductRating, { where: { product: { id: product_id }, user: user_id ? { id: user_id } : undefined, session_id: session_id ?? undefined } })
      if (!existingRating) {
        throw new NotFoundException("Rating not found")
      }

      if(  rating! <1  ) {
        await em.delete(ProductRating, { id: existingRating.id })
      }

      existingRating.rating = rating ?? existingRating.rating

      const updatedRating = await em.save(ProductRating, existingRating)
      if (!manager) await queryRunner!.commitTransaction();
      return updatedRating

    } catch (err) {
      if (!manager) await queryRunner!.rollbackTransaction();
      throw err;
    } finally {
      if (!manager) await queryRunner!.release();
    }
  }


}
