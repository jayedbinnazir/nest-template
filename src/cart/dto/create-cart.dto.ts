import { IsArray, IsOptional, IsString } from "class-validator"
import { CartItems } from "../entities/cart_item.entity"

export class CreateCartDto {


    @IsOptional()
    @IsString()
    user_id?: string | null; // Optional user ID, can be null if the cart is for a guest user


    @IsOptional()
    @IsString()
    session_id?: string | null; // Optional session ID for guest users  

}
