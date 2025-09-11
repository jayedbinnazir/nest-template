import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { OptionalJwtAuthGuard } from '../../auth/guards/jwt-cookie-optional.guard';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';   // ✅ import uuid v4




@Controller('/product/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('/:productId')
  async create(@Param("productId") productId: string, @Body() createCommentDto: CreateCommentDto, @Req() req, @Res() res: Response) {
    createCommentDto.product_id = productId
    const userId = req.user ? req.user.id : null;
    let sessionId: string | null = req.cookies.session_id as string | null;
    if (userId) {
      createCommentDto.user_id = userId;
    } else if (!userId && sessionId) {
      createCommentDto.session_id = sessionId;
    } else if (!sessionId) {
      sessionId = uuidv4()
      createCommentDto.session_id = sessionId;
    }
    try {
      const comment = await this.commentsService.createComment(createCommentDto);
      res.cookie('session_id', createCommentDto.session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return { message: "Comment created successfully", comment };
    } catch (err) {
      console.error("Error in create comment:", err);
      throw err;
    }
  }


  @Get(':productId')
  async getCommentsByProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    const comments = await this.commentsService.getCommentsByProduct(productId);
    try {
      if (!comments || comments.length === 0) {
        throw new NotFoundException('No comments found for this product');
      }

      return {
        message: 'Comments fetched successfully',
        comments,
      };
    } catch (err) {
      throw err
    }

  }


    @Patch(':commentId')
    async updateComment(
      @Param('commentId', new ParseUUIDPipe()) commentId: string,
      @Body() content: string,
    ) {
      try {
        const updatedComment = await this.commentsService.updateComment(commentId, content);
        return {
          message: 'Comment updated successfully',
          comment: updatedComment,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }