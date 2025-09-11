import { Module } from '@nestjs/common';
import { ReactionsController } from './controllers/reactions.controller';
import { ReactionsService } from './services/reactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReaction } from './entities/reaction.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReaction , Product])],
  controllers: [ReactionsController],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {}
