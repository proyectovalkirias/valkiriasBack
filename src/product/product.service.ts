import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CloudinaryService } from '../config/cloudinary';
import { CreateProductDto } from '../dtos/createProductDto';
import { UpdateProductDto } from '../dtos/updateProductDto';
import { User } from 'src/entities/user.entity';
import { FilterDto } from 'src/dtos/filterDto';
import { ProductPrice } from 'src/entities/productPrice.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductPrice)
    private readonly productPriceRepository: Repository<ProductPrice>,
    private readonly cloudinaryProvider: CloudinaryService,
  ) {}

  async getAllProducts() {
    return this.productRepository.find();
  }

  async getProductById(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    return product;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    photos: Express.Multer.File[],
    smallPrint: Express.Multer.File[] | null | undefined,
    largePrint: Express.Multer.File[] | null | undefined,
    owner: User,
  ) {
    const uploadedPhotos = await Promise.all(
      photos.map(
        async (photo) => await this.cloudinaryProvider.uploadImage(photo),
      ),
    );
    console.log('1')

    let uploadedSmallPrint: string[] | null = null;
    let uploadedLargePrint: string[] | null = null;

    // let pricesNumber: number[] = [];
    // let pricesString: string[] = [];
    // if (typeof createProductDto.prices === 'string') {
    //   pricesString = createProductDto.prices
    //     .split(',')
    //     .map((item) => item.trim());
    // }
    // if (Array.isArray(pricesString)) {
    //   pricesNumber = pricesString.map((price) => Number(price));
    // }
    // let sizesArray: string[] = [];
    // if (createProductDto.size) {
    //   if (Array.isArray(createProductDto.size)) {
    //     sizesArray = createProductDto.size;
    //   } else if (typeof createProductDto.size === 'string') {
    //     sizesArray = createProductDto.size
    //       .split(',')
    //       .map((item) => item.trim());
    //   }
    // }

    console.log('2')

    let sizesArray: string[] = [];
    if (createProductDto.size) {
      if (typeof createProductDto.size === 'string') {
        sizesArray = createProductDto.size.split(',').map((item) => item.trim());
      } else if (Array.isArray(createProductDto.size)) {
        sizesArray = createProductDto.size;
      }
    }

    let pricesArray: ProductPrice[] = [];
    if (createProductDto.prices && Array.isArray(createProductDto.prices)) {
      pricesArray = createProductDto.prices.map(price => {
        if (!price.size || typeof price.price !== 'number') {
          console.error('Invalid price object:', price);
          throw new Error('Invalid price format');
        }
        const productPrice = new ProductPrice();
        productPrice.size = price.size;
        productPrice.price = price.price;
        console.log("product prices:", productPrice);
        return productPrice;
      });
    }

    let colorArray: string[] = [];
    if (createProductDto.color) {
      if (Array.isArray(createProductDto.color)) {
        colorArray = createProductDto.color;
      } else if (typeof createProductDto.color === 'string') {
        colorArray = createProductDto.color
          .split(',')
          .map((item) => item.trim());
      }
    }

    if (smallPrint && smallPrint.length > 0) {
      uploadedSmallPrint = await Promise.all(
        smallPrint.map(async (stamp) => {
          const imgUploaded = await this.cloudinaryProvider.uploadImage(stamp);
          return imgUploaded.secure_url;
        }),
      );
    }

    if (largePrint && largePrint.length > 0) {
      uploadedLargePrint = await Promise.all(
        largePrint.map(async (stamp) => {
          const imgUploaded = await this.cloudinaryProvider.uploadImage(stamp);
          return imgUploaded.secure_url;
        }),
      );
    }

    const product = this.productRepository.create({
      ...createProductDto,
      prices: pricesArray,
      sizes: sizesArray,
      color: colorArray,
      user: owner,
      photos: uploadedPhotos.map((img) => img.secure_url),
      smallPrint: uploadedSmallPrint,
      largePrint: uploadedLargePrint,
    });

    const savedProduct = await this.productRepository.save(product);

    return savedProduct;
  }

  async changeStatusProduct(productId: string, isAvailable: boolean) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    product.isAvailable = isAvailable;
    return this.productRepository.save(product);
  }

  // async updateProduct(
  //   productId: string,
  //   updateProductDto: UpdateProductDto,
  //   photos?: Express.Multer.File[],
  //   smallPrint?: Express.Multer.File[],
  //   largePrint?: Express.Multer.File[],
  // ) {
  //   console.log('PRICES SERVICE PRINCIPIO');
  //   console.log(typeof updateProductDto.prices);
  //   const product = await this.productRepository.findOne({
  //     where: { id: productId },
  //   });
  //   if (!product)
  //     throw new NotFoundException(`Product with ID ${productId} not found`);

  //   let uploadedSmallPrint: string[] | null = null;
  //   let uploadedLargePrint: string[] | null = null;
  //   let uploadedPhotos: string[] | null = null;
  //   let sizesArray: string[] = [];

  //   if (updateProductDto.size) {
  //     if (Array.isArray(updateProductDto.size)) {
  //       sizesArray = updateProductDto.size;
  //     } else if (typeof updateProductDto.size === 'string') {
  //       sizesArray = updateProductDto.size
  //         .split(',')
  //         .map((item) => item.trim());
  //       updateProductDto.size = sizesArray;
  //     }
  //   }

  //   let colorArray: string[] = [];
  //   if (updateProductDto.color) {
  //     if (Array.isArray(updateProductDto.color)) {
  //       colorArray = updateProductDto.color;
  //     } else if (typeof updateProductDto.color === 'string') {
  //       colorArray = updateProductDto.color
  //         .split(',')
  //         .map((item) => item.trim());
  //       updateProductDto.color = colorArray;
  //     }
  //   }

  //   if (photos && photos.length > 0) {
  //     uploadedPhotos = await Promise.all(
  //       photos.map(async (photo) => {
  //         const imgUploaded = await this.cloudinaryProvider.uploadImage(photo);
  //         return imgUploaded.secure_url;
  //       }),
  //     );
  //     updateProductDto.photos = uploadedPhotos;
  //   }

  //   if (smallPrint && smallPrint.length > 0) {
  //     uploadedSmallPrint = await Promise.all(
  //       smallPrint.map(async (stamp) => {
  //         const imgUploaded = await this.cloudinaryProvider.uploadImage(stamp);
  //         return imgUploaded.secure_url;
  //       }),
  //     );
  //     updateProductDto.smallPrint = uploadedSmallPrint;
  //   }

  //   if (largePrint && largePrint.length > 0) {
  //     uploadedLargePrint = await Promise.all(
  //       largePrint.map(async (stamp) => {
  //         const imgUploaded = await this.cloudinaryProvider.uploadImage(stamp);
  //         return imgUploaded.secure_url;
  //       }),
  //     );
  //     updateProductDto.largePrint = uploadedLargePrint;
  //   }

  //   let pricesNumber: number[] = [];
  //   let pricesString: string[] = [];
  //   if (updateProductDto.prices) {
  //     if (typeof updateProductDto.prices === 'string') {
  //       pricesString = updateProductDto.prices
  //         .split(',')
  //         .map((item) => item.trim());
  //     }
  //     if (Array.isArray(pricesString)) {
  //       pricesNumber = pricesString.map((price) => Number(price));
  //       updateProductDto.prices = pricesNumber.map((price) => String(price));
  //     }
  //   }

  //   const filteredProduct = Object.keys(updateProductDto).reduce((acc, key) => {
  //     const value = updateProductDto[key];
  //     if (value === '' || value === null || value === 0) {
  //       acc[key] = undefined;
  //     } else {
  //       acc[key] = value;
  //     }
  //     return acc;
  //   }, {} as Partial<UpdateProductDto>);

  //   if (updateProductDto.prices) {
  //     product.prices = pricesNumber.map((price) => Number(price));
  //   }

  //   console.log('PRICES SERVICE FINAL');
  //   console.log(product);
  //   console.log(filteredProduct);

  //   Object.assign(product, filteredProduct);

  //   return this.productRepository.save(product);
  // }

  async deleteProduct(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    if (product.photos && product.photos.length > 0) {
      await Promise.all(
        product.photos.map((photoUrl) => {
          const publicId = this.extractPublicId(photoUrl);
          return this.cloudinaryProvider.deleteImage(publicId);
        }),
      );
    }

    return this.productRepository.remove(product);
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }

  async filterProducts(filters: FilterDto): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');

    if (filters.color) {
      query.andWhere('product.color = :color', { color: filters.color });
    }

    if (filters.category) {
      query.andWhere('product.category = :category', {
        category: filters.category,
      });
    }

    if (filters.sizes) {
      query.andWhere(':sizes = ANY(product.sizes)', {
        sizes: filters.sizes,
      });
    }

    const products = await query.getMany();
    if (products.length === 0) {
      throw new NotFoundException(
        'No se encontraron productos que coincidan con los filtros especificados.',
      );
    }
    return products;
  }
}
