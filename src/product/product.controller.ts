import {
  Body,
  Controller,
<<<<<<< HEAD
  Get,
  Param,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
=======
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
>>>>>>> a90183cacca19ec22b61ece2f3ce61f50a16554e
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/dtos/createProductDto';
import { UpdateProductDto } from 'src/dtos/updateProductDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
<<<<<<< HEAD
  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
=======
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    description: 'Pon los datos del producto y sube imagenes:',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: `string`,
          example: `Remera`,
        },
        description: {
          type: `string`,
          example: `Remera básica color blanco`,
        },
        price: {
          type: `number`,
          example: 20,
        },
        sizes: {
          type: `array`,
          items: { type: `string`, maxLength: 1 },
          example: [`S`],
        },
        category: {
          type: `string`,
          example: `Remeras`,
        },
        photos: {
          type: 'array',
          items: { type: `string`, format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor(`photos`))
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 50000000,
            message: 'El archivo no puede pesar 50mb o más',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|svg)$/,
          }),
        ],
      }),
    )
    photos: Express.Multer.File[],
    @Request() req,
  ) {
    const owner = req.user;
    console.log(req);
    console.log(req.user);
    return await this.productService.createProduct(
      createProductDto,
      photos,
      owner,
    );
>>>>>>> a90183cacca19ec22b61ece2f3ce61f50a16554e
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
