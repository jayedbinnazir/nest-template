import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductComment } from '../entities/comment.entity';
import { Product } from '../../product/entities/product.entity';


@Injectable()
export class CommentsService {

  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(ProductComment)
    private readonly commentRepository: Repository<ProductComment>
  ) { }

async createComment(createCommentDto: CreateCommentDto, manager?: EntityManager) {

    let queryRunner = manager ? undefined : this.datasource.createQueryRunner()
    let em = manager ?? queryRunner!.manager;

    if (queryRunner!.manager) {
      await queryRunner?.connect()
      await queryRunner?.startTransaction()
    }

    if (!createCommentDto.product_id) {
      throw new BadRequestException("Product not Found")
    }
    if (createCommentDto.parent_comment_id) {
      const parent = await em.findOne(ProductComment, {
        where: { id: createCommentDto.parent_comment_id, product: { id: createCommentDto.product_id } }
      });
      if (!parent) throw new BadRequestException("Invalid parent comment");
    }

    try {
      const newComment = em.create(ProductComment, {

        product: { id: createCommentDto.product_id },
        user: createCommentDto?.user_id ? { id: createCommentDto.user_id } : null,
        session_id: createCommentDto.session_id || null,
        parentComment: createCommentDto.parent_comment_id ? { id: createCommentDto.parent_comment_id } : null,
        content: createCommentDto.content

      })

      const savedComment = await em.save(ProductComment, newComment);
      if (!manager) await queryRunner!.commitTransaction();
      return savedComment;


    } catch (err) {
      if (!manager) await queryRunner!.rollbackTransaction();
      console.error("Error in CommentsService createComment:", err);
      throw err;
    } finally {
      if (!manager) await queryRunner!.release();
    }
  }


async getCommentsByProduct(productId: string) {
  if (!productId) {
    throw new BadRequestException("Product ID is required");
  }

  // ✅ Check if product exists
  const product = await this.datasource
    .getRepository(Product)
    .findOneBy({ id: productId });

  if (!product) {
    throw new NotFoundException("Product not found");
  }

  try {
    // ✅ Fetch comments (including replies and user if needed)
    const comments = await this.commentRepository.find({
      where: { product: { id: productId }, parentComment: undefined }, // only top-level comments
      relations: ["user", "replies", "replies.user"], // eager load replies + users
      order: { created_at: "DESC" }, // newest first (optional)
    });

    return comments;
  } catch (err) {
    console.error("Problem with fetching comments:", err.message);
    throw err;
  }
}


async updateComment(commentId:string ,content:string ,manager?:EntityManager){
     let queryRunner = manager ? undefined : this.datasource.createQueryRunner()
    let em = manager ?? queryRunner!.manager;

    if (queryRunner!.manager) {
      await queryRunner?.connect()
      await queryRunner?.startTransaction()
    }
    try {
      const comment = await em.findOne(ProductComment , {
        where:{id:commentId}
      })

      if(!comment) {
        throw new NotFoundException("Comment not found") ;
      }

      comment.content = content ;
      const updated = await em.save(ProductComment , comment) ;
      if (!manager) await queryRunner!.commitTransaction();
      return updated ;

    } catch (err) {
      if (!manager) await queryRunner!.rollbackTransaction();
      console.error("Error in CommentsService updateComment:", err);
      throw err;
    } finally {
      if(!manager) await queryRunner!.release();
    }
}


  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
