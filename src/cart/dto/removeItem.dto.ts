import { IsOptional, IsString } from "class-validator";

export class RemoveCartItemDto {
  
  @IsString()
  cartId: string;   

  @IsString()
  productId: string;
  
}
