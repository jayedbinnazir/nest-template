// cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItems } from '../entities/cart_item.entity';
import { Product } from '../../product/entities/product.entity';
import crypto from 'crypto';
import { CreateCartDto } from '../dto/create-cart.dto';
import { strict } from 'assert';
import { AddToCartDto } from '../dto/addToCart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';

// Example: "9b1de4a1f7c44e21a9c7b2c2c8d13f93"



@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItems)
        private cartItemsRepository: Repository<CartItems>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        private readonly dataSource: DataSource
    ) { }

    //it will happen when their will be sessionId or it will not happen, OK!!!-->Yes
    async attachUserToCart(userId: string, sessionId: string, manager?: EntityManager): Promise<Cart> {
        const queryRunner = manager ? undefined : this.dataSource.createQueryRunner();
        const em = manager ?? queryRunner!.manager;

        if (!manager) {
            await queryRunner!.connect();
            await queryRunner!.startTransaction();
        }

        try {
            if (!userId || !sessionId) {
                throw new Error('Both userId and sessionId are required');
            }

            // Find the guest cart by session_id
            const guestCart = await em.findOne(Cart, {
                where: { session_id: sessionId, user: undefined },
                relations: ['cart_items'],
            });

            if (!guestCart) {
                throw new NotFoundException('Guest cart not found');
            }

            guestCart.user = { id: userId } as any;
            guestCart.session_id = null; // no longer needed
            const updatedCart = await em.save(Cart, guestCart);

            if (!manager) await queryRunner!.commitTransaction();
            return updatedCart;

        } catch (error) {
            if (!manager) await queryRunner!.rollbackTransaction();
            throw error;
        } finally {
            if (!manager) await queryRunner!.release();
        }
    }

    //this is only available in login , when their is a sessionId for cart
    // this is only available in login , when there is a sessionId for cart
    async mergeCart(userId: string, sessionId: string, manager?: EntityManager): Promise<Cart> {
        const queryRunner = manager ? undefined : this.dataSource.createQueryRunner();
        const em = manager ?? queryRunner!.manager;

        if (!manager) {
            await queryRunner!.connect();
            await queryRunner!.startTransaction();
        }

        try {
            if (!userId || !sessionId) {
                throw new Error('Both userId and sessionId are required');
            }

            // Find the guest cart by session_id
            const guestCart = await em.findOne(Cart, {
                where: { session_id: sessionId, user: undefined },
                relations: ['cart_items', 'cart_items.product'],
            });

            if (!guestCart) {
                throw new NotFoundException('Guest cart not found');
            }

            // Find the user's existing cart
            let userCart = await em.findOne(Cart, {
                where: { user: { id: userId }, session_id: undefined },
                relations: ['cart_items', 'cart_items.product'],
            });

            if (!userCart) {
                // ✅ If user has no cart, create a fresh one and copy guest items
                userCart = em.create(Cart, {
                    user: { id: userId } as any,
                    session_id: null,
                    cart_items: [],
                });
                await em.save(userCart);
            }

            // ✅ Merge guest cart items into user cart
            for (const guestItem of guestCart.cart_items) {
                const existingItem = userCart.cart_items.find(
                    (ucItem) => ucItem.product.id === guestItem.product.id,
                );

                if (existingItem) {
                    // If product already exists → increase quantity
                    existingItem.quantity += guestItem.quantity;
                    await em.save(existingItem);
                } else {
                    // If product does not exist → create a new CartItem for userCart
                    const newCartItem = em.create(CartItems, {
                        cart: userCart,
                        product: guestItem.product,
                        quantity: guestItem.quantity,
                        priceAtAddTime: guestItem.priceAtAddTime,
                    });
                    await em.save(newCartItem);
                }
            }

            // ❌ Delete the guest cart and its items (cleanup)
            await em.remove(guestCart);

            // Return merged cart with updated items
            const mergedCart = await em.findOne(Cart, {
                where: { id: userCart.id },
                relations: ['cart_items', 'cart_items.product'],
            });

            if (!manager) await queryRunner!.commitTransaction();
            return mergedCart!;
        } catch (err) {
            if (!manager) await queryRunner!.rollbackTransaction();
            throw err;
        } finally {
            if (!manager) await queryRunner!.release();
        }
    }



    // Find or create cart for user/session
    async findOrCreateCart(createCartDto: CreateCartDto, manager?: EntityManager): Promise<Cart> {

        const queryRunner = manager
            ? undefined
            : this.dataSource.createQueryRunner();

        const em = manager ?? queryRunner!.manager;

        if (!manager) {
            await queryRunner!.connect();
            await queryRunner!.startTransaction();
        }

        const { user_id: userId, session_id: sessionId } = createCartDto;

        let cart: Cart | null = null;

        try {

            if (userId) {
                // Try to find cart by user ID
                cart = await this.cartRepository.findOne({
                    where: { user_id: userId },
                    relations: ['cart_items', 'cart_items.product'],
                }) as Cart;
            } else if (sessionId) {
                // Try to find cart by session ID
                cart = await this.cartRepository.findOne({
                    where: { session_id: sessionId },
                    relations: ['cart_items', 'cart_items.product'],
                }) as Cart;
            }

            // If cart doesn't exist, create a new one
            if (!cart) {
                cart = em.create(Cart, {
                    user: userId ? { id: userId } : null,
                    session_id: sessionId,
                });
                cart = await em.save(Cart, cart);
            }

            if (!manager) {
                await queryRunner!.commitTransaction();
            }

            return cart;

        } catch (error) {
            if (!manager) {
                await queryRunner!.rollbackTransaction();
            }
            throw error;
        } finally {
            if (!manager) {
                await queryRunner!.release();
            }
        }
    }

    // Add item to cart
    async addToCart(addToCart: AddToCartDto, manager?: EntityManager): Promise<Cart> {

        const queryRunner = manager
            ? undefined
            : this.dataSource.createQueryRunner();

        const em = manager ?? queryRunner!.manager;

        if (!manager) {
            await queryRunner!.connect();
            await queryRunner!.startTransaction();
        }

        const { user_id, session_id, product_id, quantity } = addToCart;
        try {

            // Find or create cart
            const cart = await this.findOrCreateCart({ user_id, session_id }, em);
            // Find product
            const product = await this.productRepository.findOne({
                where: { id: product_id }
            });

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            // Check if product already exists in cart
            const cartItems = cart.cart_items ?? [];
            const existingItem = cartItems.find(
                item => item.product_id === product_id
            );

            if (existingItem) {
                // Update quantity if item exists
                existingItem.quantity += quantity;
                await em.save(CartItems, existingItem);
            } else {
                // Create new cart item
                const newItem = em.create(CartItems, {
                    cart_id: cart.id,
                    product_id: product_id,
                    quantity,
                    priceAtAddTime: product.price,
                });

                cart.cart_items.push(newItem);
                await em.save(CartItems, newItem);
            }

            return em.save(Cart, cart);

        } catch (error) {
            if (!manager) {
                await queryRunner!.rollbackTransaction();
            }
            throw error;
        } finally {
            if (!manager) {
                await queryRunner!.release();
            }
        }
    }

    // Remove item from cart
    async removeFromCart(
        productId: string,
        userId: string | null,
        sessionId: string | null,
        manager?: EntityManager
    ): Promise<Cart> {

         const queryRunner = manager
            ? undefined
            : this.dataSource.createQueryRunner();

        const em = manager ?? queryRunner!.manager;

        if (!manager) {
            await queryRunner!.connect();
            await queryRunner!.startTransaction();
        }

        try {

             const cart = await this.findOrCreateCart({ user_id: userId, session_id: sessionId } , em);

        // Find the item index
        const itemIndex = cart.cart_items.findIndex(
            item => item.product_id === productId
        );

        if (itemIndex > -1) {
            // Remove item
            await this.cartItemsRepository.remove(cart.cart_items[itemIndex]);
            cart.cart_items.splice(itemIndex, 1);
        }

        const updatedCart = await this.cartRepository.save(cart);
        if (!manager) {
            await queryRunner!.commitTransaction();
        }
        return updatedCart;

        } catch (error) {
            if (!manager) {
                await queryRunner!.rollbackTransaction();
            }
            throw error;
        } finally {
            if (!manager) {
                await queryRunner!.release();
            }
        }
    }




    // // Update item quantity
    // async updateQuantity(
    //     productId: string, 
    //     quantity: number, 
    //     userId: string | null, 
    //     sessionId: string | null
    // ): Promise<Cart> {
    //     const cart = await this.findOrCreateCart(userId, sessionId);

    //     // Find the item
    //     const item = cart.cart_items.find(
    //         item => item.product_id === productId
    //     );

    //     if (item) {
    //         if (quantity <= 0) {
    //             // Remove if quantity is 0 or less
    //             return this.removeFromCart(productId, userId, sessionId);
    //         }

    //         item.quantity = quantity;
    //         await this.cartItemsRepository.save(item);
    //     }

    //     return this.cartRepository.save(cart);
    // }

    // // Get cart
    // async getCart(userId: string | null, sessionId: string | null): Promise<Cart> {
    //     return this.findOrCreateCart(userId, sessionId);
    // }

    // // Clear cart
    // async clearCart(userId: string | null, sessionId: string | null): Promise<Cart> {
    //     const cart = await this.findOrCreateCart(userId, sessionId);

    //     // Remove all items
    //     await this.cartItemsRepository.remove(cart.cart_items);
    //     cart.cart_items = [];

    //     return this.cartRepository.save(cart);
    // }

    // // Merge guest cart with user cart after login
    // async mergeCarts(userId: string, sessionId: string): Promise<Cart> {
    //     // Get user cart
    //     const userCart = await this.findOrCreateCart(userId, null);

    //     // Get guest cart
    //     const guestCart = await this.findOrCreateCart(null, sessionId);

    //     if (guestCart.cart_items.length > 0) {
    //         // Add guest cart items to user cart
    //         for (const item of guestCart.cart_items) {
    //             const existingItem = userCart.cart_items.find(
    //                 userItem => userItem.product_id === item.product_id
    //             );

    //             if (existingItem) {
    //                 // Update quantity if product exists
    //                 existingItem.quantity += item.quantity;
    //                 await this.cartItemsRepository.save(existingItem);
    //             } else {
    //                 // Add new item
    //                 const newItem = this.cartItemsRepository.create({
    //                     cart_id: userCart.id,
    //                     product_id: item.product_id,
    //                     quantity: item.quantity,
    //                     priceAtAddTime: item.priceAtAddTime,
    //                 });
    //                 userCart.cart_items.push(newItem);
    //                 await this.cartItemsRepository.save(newItem);
    //             }
    //         }

    //         // Clear guest cart
    //         await this.clearCart(null, sessionId);
    //     }

    //     return this.cartRepository.save(userCart);
    // }
}