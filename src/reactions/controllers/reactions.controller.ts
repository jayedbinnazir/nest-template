import { Controller, Post, Body, Req, Res, Get, Param } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { ReactionsService } from '../services/reactions.service';
import { CreateReactionDto } from '../dto/create-reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async react(
    @Body() createReactionDto: CreateReactionDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user ? req.user.id : null;
    let sessionId: string | null = req.cookies.session_id || null;

    if (userId) {
      createReactionDto.user_id = userId;
    } else if (!userId && sessionId) {
      createReactionDto.session_id = sessionId;
    } else if (!sessionId) {
      sessionId = uuidv4();
      createReactionDto.session_id = sessionId;
    }

    const reaction = await this.reactionsService.createOrUpdateReaction(createReactionDto);

    res.cookie('session_id', createReactionDto.session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      message: reaction
        ? `Reaction set to ${reaction.type}`
        : 'Reaction removed',
      reaction,
    };
  }

  @Get(':productId')
  async getSummary(@Param('productId') productId: string) {
    try {
      const summary = await this.reactionsService.getReactionsSummary(productId);
      return {
        message: 'Reactions summary fetched successfully',
        summary,
      };
    } catch (err) {
      console.error('Error in get reactions summary:', err);
      throw err;
    }
  }
}
