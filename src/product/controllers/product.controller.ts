import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req, UploadedFile, UploadedFiles, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtCookieGuard } from '../../auth/guards/jwt-cookie.guard';
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProductQueryDto } from '../dto/productQuery.dto';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtCookieGuard)
  @Post('create')
  @UseInterceptors(FilesInterceptor('product_images',4)) // Assuming 'product_images' is the field name for file upload
  async create(@Req() req , @Body() createProductDto: CreateProductDto , @UploadedFiles() files?: Express.Multer.File[]) {
    console.log("=== PRODUCT CREATION START ===")
    console.log("create product controller called")
    console.log("Raw body received:", req.body);
    console.log("createProductDto in controller", createProductDto);
    console.log("file in controller", files);
    console.log("DTO validation status: PASSED (if this logs)");
      const user = req["user"]
      console.log("user in product creation", user);
      createProductDto.user_id = user.id ;
      createProductDto.product_images = files; // Assign the uploaded file to the DTO
      
      try {

        return await this.productService.createProduct(createProductDto);

      } catch (error) {
        console.error('Error during product creation:', error);
        throw error; // Re-throw the error to be handled by global exception filter
      }
  }

  @Get("get-all")
  async findAll( @Query() query: ProductQueryDto) {

    console.log("query params in findAll", query);
    try {
      const allProducts =  await this.productService.findAllProduct(query);
      return allProducts;
    
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOneProduct(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.updateProduct(id, updateProductDto);
  // }

  @Delete('/softRemove/:id')
  remove(@Param('id') id: string) {
    return this.productService.softRemoveemoveProduct(id);
  }

  @Delete('/hard/:id')
  hardRemove(@Param('id') id: string) {
    return this.productService.hardRemove(id);
  }


}
