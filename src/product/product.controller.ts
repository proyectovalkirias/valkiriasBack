import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/dtos/createProductDto';
import { UpdateProductDto } from 'src/dtos/updateProductDto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterDto } from 'src/dtos/filterDto';
import { Product } from 'src/entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  // @UseGuards(AuthGuard)
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
          type: 'decimal',
          example: 1000,
        },
        sizes: {
          type: `array`,
          items: { type: `string`, maxLength: 1 },
          example: [`S`],
        },
        color: {
          type: `array`,
          items: { type: `string`, maxLength: 1 },
          example: ['Blanco'],
        },
        category: {
          type: `string`,
          example: `Remeras`,
        },
        photos: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        stamped: {
          type: `array`,
          items: { type: 'string', format: 'binary' },
        },
        stock: {
          type: `number`,
          example: 10,
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'photos' }, { name: 'stamped' }], {
      limits: { fileSize: 50000000 }, // Peso máximo 50MB
      fileFilter: (req, files, res) => {
        if (!/(jpg|jpeg|png|webp|svg)$/.test(files.mimetype)) {
          return res(
            new BadRequestException(
              'El archivo pesa más de 50MB o el formato no es válido',
            ),
            false,
          );
        }
        res(null, true);
      },
    }),
  )
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: { photos?: Express.Multer.File[]; stamped?: Express.Multer.File[] },
    @Request() req,
  ) {
    const owner = req.user;
    const photos = files.photos;
    const stamped = files.stamped;
    return await this.productService.createProduct(
      createProductDto,
      photos,
      stamped,
      owner,
    );
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
  @ApiConsumes('multipart/form-data')
  // @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    description: 'Pon los datos a actualizar del producto:',
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
          type: 'decimal',
          example: 1000,
        },
        sizes: {
          type: `array`,
          items: { type: `string`, maxLength: 1 },
          example: [`S`],
        },
        color: {
          type: `array`,
          items: { type: `string`, maxLength: 1 },
          example: ['Blanco'],
        },
        category: {
          type: `string`,
          example: `Remeras`,
        },
        photos: {
          type: 'array',
          items: { type: `string`, format: 'binary' },
        },
        stamped: {
          type: `array`,
          items: { type: `string`, format: `binary` },
        },
        stock: {
          type: `number`,
          example: 10,
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor(`photos`))
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

  @Get('filter')
  async filterProducts(@Query() filters: FilterDto): Promise<Product[]> {
    if (Object.keys(filters).length === 0) {
      throw new BadRequestException('Necesito un Valkifiltro, Valkisalame.');
    }

    return this.productService.filterProducts(filters);
  }

  @ApiOperation({ summary: 'Get a product by id' })
  @Get(':productId')
  getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
  }
}
