import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/dtos/createProductDto';
import { UpdateProductDto } from 'src/dtos/updateProductDto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
  }

  @ApiOperation({ summary: 'Change the status of a product' })
  @Post('change-status/:productId')
  changeStatusProduct(
    @Param('productId') productId: string,
    @Body() isAvailable: boolean,
  ) {
    return this.productService.changeStatusProduct(productId, isAvailable);
  }

  @ApiOperation({ summary: 'Update a product' })
  @Post('update/:productId')
  updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(productId, updateProductDto);
  }
  @ApiOperation({ summary: 'Delete a product' })
  @Post('delete/:productId')
  deleteProduct(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ApiOperation({ summary: 'Get a product by id' })
  @Get(':productId')
  getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
  }
}
