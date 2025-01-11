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
      throw new NotFoundException(`Productc con ID ${productId} no encontrado`);

    return product;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    photos: Express.Multer.File[],
    smallPrint: Express.Multer.File[] | null | undefined,
    largePrint: Express.Multer.File[] | null | undefined,
    owner: User,
  ) {
    console.log(createProductDto);
    console.log(photos);
    console.log(typeof photos);
    const uploadedPhotos = await Promise.all(
      photos.map(async (photo) => {
        const imgUploaded = await this.cloudinaryProvider.uploadImage(photo);
        return imgUploaded.secure_url;
      }),
    );
    console.log('1');

    let uploadedSmallPrint: string[] | null = null;
    let uploadedLargePrint: string[] | null = null;

    console.log('2');

    let sizesArray: string[] = [];
    if (createProductDto.size) {
      if (typeof createProductDto.size === 'string') {
        sizesArray = createProductDto.size
          .split(',')
          .map((item) => item.trim());
      } else if (Array.isArray(createProductDto.size)) {
        sizesArray = createProductDto.size;
      }
    }

    let pricesArray: ProductPrice[] = [];
    if (createProductDto.prices && Array.isArray(createProductDto.prices)) {
      pricesArray = createProductDto.prices.map((price) => {
        if (!price.size || typeof price.price !== 'number') {
          console.error('Invalid price object:', price);
          throw new Error('Formato de precio inválido');
        }
        const productPrice = new ProductPrice();
        productPrice.size = price.size;
        productPrice.price = price.price;
        console.log('product prices:', productPrice);
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
      photos: uploadedPhotos,
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
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);

    product.isAvailable = isAvailable;
    return this.productRepository.save(product);
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
    photos?: Express.Multer.File[],
    smallPrint?: Express.Multer.File[],
    largePrint?: Express.Multer.File[],
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);

    let updatedPhotos: string[] = product.photos || [];
    let updatedSmallPrint: string[] | null = product.smallPrint || null;
    let updatedLargePrint: string[] | null = product.largePrint || null;

    let sizesArray: string[] = [];
    if (updateProductDto.size) {
      if (typeof updateProductDto.size === 'string') {
        sizesArray = updateProductDto.size
          .split(',')
          .map((item) => item.trim());
      } else if (Array.isArray(updateProductDto.size)) {
        sizesArray = updateProductDto.size;
      }
    }

    let colorArray: string[] = [];
    if (updateProductDto.color) {
      if (typeof updateProductDto.color === 'string') {
        colorArray = updateProductDto.color
          .split(',')
          .map((item) => item.trim());
      } else if (Array.isArray(updateProductDto.color)) {
        colorArray = updateProductDto.color;
      }
    }

    if (photos && photos.length > 0) {
      const uploadedPhotos = await Promise.all(
        photos.map(async (photo) => {
          const imgUploaded = await this.cloudinaryProvider.uploadImage(photo);
          return imgUploaded.secure_url;
        }),
      );
      updatedPhotos = [...updatedPhotos, ...uploadedPhotos];
    }

    if (smallPrint && smallPrint.length > 0) {
      const uploadedSmallPrint = await Promise.all(
        smallPrint.map(async (stamp) => {
          const imgUploaded = await this.cloudinaryProvider.uploadImage(stamp);
          return imgUploaded.secure_url;
        }),
      );
      updatedSmallPrint = [...(updatedSmallPrint || []), ...uploadedSmallPrint];
    }

    if (largePrint && largePrint.length > 0) {
      const uploadedLargePrint = await Promise.all(
        largePrint.map(async (stamp) => {
          const imgUploaded = await this.cloudinaryProvider.uploadImage(stamp);
          return imgUploaded.secure_url;
        }),
      );
      updatedLargePrint = [...(updatedLargePrint || []), ...uploadedLargePrint];
    }

    let pricesArray: ProductPrice[] = [];
    if (updateProductDto.prices && Array.isArray(updateProductDto.prices)) {
      pricesArray = updateProductDto.prices.map((price) => {
        if (!price.size || typeof price.price !== 'number') {
          console.error('Invalid price object:', price);
          throw new Error('Formato de precio inválido');
        }
        const productPrice = new ProductPrice();
        productPrice.size = price.size;
        productPrice.price = price.price;
        return productPrice;
      });
    }

    Object.assign(product, {
      ...updateProductDto,
      sizes: sizesArray.length > 0 ? sizesArray : product.sizes,
      color: colorArray.length > 0 ? colorArray : product.color,
      prices: pricesArray.length > 0 ? pricesArray : product.prices,
      photos: updatedPhotos,
      smallPrint: updatedSmallPrint,
      largePrint: updatedLargePrint,
    });

    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  async deleteProduct(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);

    if (product.photos && product.photos.length > 0) {
      await Promise.all(
        product.photos.map((photoUrl) => {
          const publicId = this.extractPublicId(photoUrl);
          return this.cloudinaryProvider.deleteImage(publicId);
        }),
      );
    }

    await this.productRepository.remove(product);
    return `Producto eliminado.`;
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
