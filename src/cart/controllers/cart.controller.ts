import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, Optional, Put } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { AddToCartDto } from '../dto/addToCart.dto';
import { Response } from 'express';
import { OptionalJwtAuthGuard } from '../../auth/guards/jwt-cookie-optional.guard';
import { v4 as uuidv4 } from 'uuid';   // ✅ import uuid v4
import { UpdateCartItemDto } from '../dto/updateCartItem.dto';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }


  @UseGuards(OptionalJwtAuthGuard)
  @Post("add-to-cart")
  async addToCart(
    @Body() addToCart: AddToCartDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    let sessionId: string | null = null;
    const userId = req.user ? req.user.id : null; // ✅ userId if logged in, null if guest
    try {


      if (!userId) {
        sessionId = req.cookies.session_id;

        if (!sessionId) {
          sessionId = uuidv4();  // ✅ Generate UUID v4
          addToCart.session_id = sessionId;
        }
      }

      const cart = await this.cartService.addToCart(addToCart);

      if (!req.user || !req.cookies.session_id) {
        res.cookie('session_id', cart.session_id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'prod',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
      }

      return cart;

    } catch (err) {
      console.error("Error in addToCart:", err);
      throw err;
    }
  }


  @UseGuards(OptionalJwtAuthGuard)
  @Put('update-cart-item')
  async updateCartItem(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    try {

      return await this.cartService.updateCartItemQuantity(updateCartItemDto);
    }
    catch (err) {
      console.error("Error in updateCartItem:", err);
      throw err;
    }
  }



  @UseGuards(OptionalJwtAuthGuard)
  @Put('remove-from-cart/:cartId')
  async removeFromCart(
    @Param('cartId') cartId: string,
    @Body("productId") productId: string,
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {

    if (!cartId || !productId) {
      throw new Error("cartId and productId are required");
    }

    try {

      return await this.cartService.removeFromCart({ cartId, productId });

    } catch (err) {
      console.error("Error in removeFromCart:", err);
      throw err;
    }
  }






  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartService.remove(+id);
  // }
}
