import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { RatingsService } from '../services/ratings.service';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { OptionalJwtAuthGuard } from '../../auth/guards/jwt-cookie-optional.guard';
import { v4 as uuidv4 } from 'uuid';   // ✅ import uuid v4
import { Response } from 'express';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) { }


  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(@Body() createRatingDto: CreateRatingDto, @Req() req, @Res({ passthrough: true }) res: Response) {
    let userId = req.user ? req.user.id : null;
    let sessionId: string | null = req.cookies.session_id as string | null;

    if (userId) {
      createRatingDto.user_id = userId;
    } else if (!userId && sessionId) {
      createRatingDto.session_id = sessionId;
    } else if (!userId && !sessionId) {
      sessionId = uuidv4()
      createRatingDto.session_id = sessionId;
    }
    try {

      res.cookie('session_id', createRatingDto.session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      const rating = await this.ratingsService.rate(createRatingDto);
      return { message: "Rating created successfully", rating };
    } catch (err) {
      console.error("Error in create rating:", err);
      throw err;
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Patch("update")
  async update(@Body() updateRatingDto: UpdateRatingDto, @Req() req) {
    let userId = req.user ? req.user.id : null;
    let sessionId: string | null = req.cookies.session_id as string | null;

    if (userId) {
      updateRatingDto.user_id = userId;
    } else if (!userId && sessionId) {
      updateRatingDto.session_id = sessionId;
    }
    try {
      const rating = await this.ratingsService.updateRating(updateRatingDto);
      return { message: "Rating created successfully", rating };
    } catch (err) {
      console.error("Error in create rating:", err);
      throw err;
    }
  }


}
