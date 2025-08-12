import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req, UploadedFile } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { JwtCookieGuard } from '../../auth/guards/jwt-cookie.guard';
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtCookieGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('product_images')) // Assuming 'product_images' is the field name for file upload
  async create(@Req() req , @Body() createProductDto: CreateProductDto , @UploadedFile() file?: Express.Multer.File) {
    console.log("=== PRODUCT CREATION START ===")
    console.log("create product controller called")
    console.log("Raw body received:", req.body);
    console.log("createProductDto in controller", createProductDto);
    console.log("file in controller", file);
    console.log("DTO validation status: PASSED (if this logs)");
      const user = req["user"]
      console.log("user in product creation", user);
      createProductDto.user_id = user.id ;
      createProductDto.product_images = file; // Assign the uploaded file to the DTO
      
      try {

        return await this.productService.createProduct(createProductDto);

      } catch (error) {
        console.error('Error during product creation:', error);
        throw error; // Re-throw the error to be handled by global exception filter
      }
  }

  @Get()
  async findAll() {
    return await this.productService.findAllProduct();
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

  @Delete('/hardRemove/:id')
  hardRemove(@Param('id') id: string) {
    return this.productService.hardRemove(id);
  }


}
