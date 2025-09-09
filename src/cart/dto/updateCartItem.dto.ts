import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { CartItems } from "../entities/cart_item.entity"

export class UpdateCartItemDto {


    @IsOptional()
    @IsString()
    cartId: string;

    @IsString()
    productId: string;

    @IsNumber()
    quantity: number;
    
}
