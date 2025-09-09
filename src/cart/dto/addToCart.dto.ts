import { IsNumber, IsOptional, IsString } from "class-validator";

export class AddToCartDto {
    @IsOptional()
    @IsString()
    user_id?: string | null;

    @IsOptional()
    @IsString()
    session_id?: string|null;

    @IsOptional()
    @IsString()
    product_id: string;

    @IsNumber()
    quantity: number;
}