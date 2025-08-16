import { ArrayMaxSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

export class CreateProductDto {

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string; // Example: "Elf Bar 5000 Puff", "Mango Ice E-liquid 60ml"


    @Transform(({ value }) => {
        if (value === "" || value === undefined || value === null) {
            return null;
        }
        return String(value);
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    importedFrom?: string; // Example: "China", "USA"



    @Transform(({ value }) => {
        if (value === "" || value === undefined || value === null) {
            return null;
        }
        return String(value);
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string | null;


    @Transform(({ value }) => {

        if (value === "" || value === undefined || value === null) {
            return null;
        }

        const num = Number(value);
        console.log("Transformed price value:", typeof num)

        // If it's not a valid number, keep it as is so validation will fail
        return isNaN(num) ? value : num;
    })
    // @IsOptional()
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Price must be a valid number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    price: number;

    @Transform(({ value }) => {
        console.log("Transforming quantity value:", value);
        if (value === "" || value === undefined || value === null) {
            return 0; // Default to 0 if not provided
        }
        const num = Number(value);
        console.log("Transformed price value:", typeof num)
        // If it's not a valid number, keep it as is so validation will fail
        return isNaN(num) ? value : num;
    })
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Price must be a valid number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    quantity?: number; // Example: 100, 50, 200


    @Transform(({ value }) => {
        if (value === "true" || value === true) return true;
        if (value === "false" || value === false) return false;
        return value; // Let validation handle invalid values
    })
    @IsBoolean({ message: 'Availability must be a boolean' })
    isAvailable: boolean;

    @Transform(({ value }) => {
        if (value === "" || value === undefined || value === null) {
            return null;
        }
        return String(value);
    })
    @IsOptional()
    @IsString({ message: 'brand must be a string value' })
    brand?: string | null; // Example: "Vaporesso", "Elf Bar", "SMOK"



    @Transform(({ value }) => {
        if (value === "" || value === undefined || value === null) {
            return null;
        }
        return String(value);
    })
    @IsOptional()
    @IsString({ message: 'Nicotine strength must be string value' })
    nicotineStrength?: string | null; // Example: "3mg", "20mg", "50mg"

    @Transform(({ value }) => {
        if (value === "" || value === undefined || value === null) {
            return null;
        }
        return String(value);
    })
    @IsOptional()
    @IsString({ message: 'flavour must be a string value' })
    flavor?: string; // Example: "Mango Ice", "Cool Mint"


    // Add any additional fields as necessary
    @IsOptional() // Make this optional since it's set in the controller
    @IsString({ message: 'User ID must be a string' })
    user_id?: string; // The ID of the user creating the product

    @IsNotEmpty()
    @IsString()
    category_id: string

    @IsArray()
    @ArrayMaxSize(4, { message: 'Maximum 4 images allowed' })
    @IsOptional()
    product_images?: Express.Multer.File[]   // The file uploaded for the product image
}
