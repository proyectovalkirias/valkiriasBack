import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
} from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterDto } from 'src/dtos/filterDto';
import { Product } from 'src/entities/product.entity';
import { RoleGuard } from 'src/guards/role.guard';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
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
        prices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              size: { type: 'string', example: 'M' },
              price: { type: 'number', example: 10000 },
            },
          },
          example: [
            { size: 'M', price: 10000 },
            { size: 'L', price: 12000 },
          ],
        },
        size: {
          type: 'array',
          items: { type: 'string' },
          example: ['16', 'S', 'M', 'L'],
        },
        color: {
          type: 'array',
          items: { type: `string` },
          example: ['Blanco'],
        },
        category: {
          type: 'string',
          example: 'Remeras',
        },
        photos: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        smallPrint: {
          type: 'array',
          nullable: true,
          items: { type: 'string', format: 'binary', nullable: true },
        },
        largePrint: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        stock: {
          type: 'number',
          example: 10,
        },
        isCostumizable: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'photos' }, { name: 'smallPrint' }, { name: 'largePrint' }],
      {
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
      },
    ),
  )
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      photos?: Express.Multer.File[];
      smallPrint?: Express.Multer.File[];
      largePrint?: Express.Multer.File[];
    },
    @Request() req,
  ) {
    if (typeof createProductDto.prices === 'string') {
      createProductDto.prices = JSON.parse(createProductDto.prices);
    }
    const owner = req.user;
    const photos = files.photos;
    const smallPrint = files.smallPrint;
    const largePrint = files.largePrint;

    return await this.productService.createProduct(
      createProductDto,
      photos,
      smallPrint,
      largePrint,
      owner,
    );
  }

  @ApiOperation({ summary: 'Change the status of a product' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Post('change-status/:productId')
  changeStatusProduct(
    @Param('productId') productId: string,
    @Body() isAvailable: boolean,
  ) {
    return this.productService.changeStatusProduct(productId, isAvailable);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
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
        prices: {
          type: 'array',
          items: { type: 'string' },
          example: ['10000', '20000'],
        },
        size: {
          type: 'array',
          items: { type: 'string' },
          example: ['S', 'M', 'L'],
        },
        color: {
          type: 'array',
          items: { type: `string` },
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
        smallPrint: {
          type: `array`,
          items: { type: `string`, format: `binary` },
        },
        largePrint: {
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos' },
      { name: 'smallPrint' },
      { name: 'largePrint' },
    ]),
  )
  @Put('update/:productId')
  updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      photos?: Express.Multer.File[];
      smallPrint?: Express.Multer.File[];
      largePrint?: Express.Multer.File[];
    },
  ) {
    console.log('PRICES CONTROLLER');
    console.log(typeof updateProductDto.prices);
    const photos = files?.photos;
    const smallPrint = files?.smallPrint;
    const largePrint = files?.largePrint;
    return this.productService.updateProduct(
      productId,
      updateProductDto,
      photos,
      smallPrint,
      largePrint,
    );
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Delete('delete/:productId')
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
      throw new BadRequestException('Necesito un Valkifiltro.');
    }

    return this.productService.filterProducts(filters);
  }

  @ApiOperation({ summary: 'Get a product by id' })
  @Get(':productId')
  getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
  }
}
