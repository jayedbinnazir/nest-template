import { Expose, Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  name: string;

  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return value;
  })
  @ValidateIf(o => o.description !== null)
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must be less than 1000 characters' })
  description?: string;

  // "" => 0 , null => 0 , undefined => 0 , NaN => 0 , Infinity => 0 , -Infinity => 0

 
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    else if(typeof value === 'string'){
      const num = parseFloat(value);
      return Number.isNaN(num) ? value : num;
    }
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Price must be a number' },
  )
  @Min(0, { message: 'Price must be zero or a positive integer' })
  price?: number = 0;


  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return 0;
    } else if(typeof value === 'string'){
      const num = parseFloat(value);
      return Number.isNaN(num) ? value : num;
    }
    return value;
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Stock quantity must be a number' },
  )
  @IsInt({ message: 'Stock quantity must be an integer' })
  @Min(0, { message: 'Stock quantity must be zero or a positive integer' })
  stock_quantity: number = 0;


  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return 0;
    } else if(typeof value === 'string'){
      const num = parseFloat(value);
      return Number.isNaN(num) ? value : num;
    }
    return value;
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Stock quantity must be a number' },
  )
  @IsInt({ message: 'Sold quantity must be an integer' })
  @Min(0, { message: 'Sold quantity must be zero or a positive integer' })
  sold_quantity: number = 0;

  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return 0;
    } else if(typeof value === 'string'){
      const num = parseFloat(value);
      return Number.isNaN(num) ? value : num;
    }
    return value;
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'view count must be a number' },
  )
  @IsInt({ message: 'view count must be an integer' })
  @Min(0, { message: 'view count must be zero or a positive integer' })
  view_count: number = 0;

  @IsOptional() // Field is optional
  @IsArray() // If provided, must be an array
  @IsString({ each: true }) // Each element must be a string
  available_colors?: string[]; // Optional in TS
 

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image_gallery?: string[] | null = []; // ✅ Optional + nullable

  @Expose()
  display_Price: string;

  @Expose()
  display_stock_quantity: string;
}
