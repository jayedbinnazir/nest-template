import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateProductCategoryDto {

    @IsString({ message: 'Product ID must be a string' })
    @IsNotEmpty({ message: 'Product ID is required' })
    product_id: string;

    @IsString({ message: 'Product ID must be a string' })
    @IsNotEmpty({ message: 'Category ID is required' })
    category_id: string;

}
