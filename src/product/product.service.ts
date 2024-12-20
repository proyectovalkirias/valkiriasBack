import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CloudinaryService } from '../config/cloudinary';
import { CreateProductDto } from '../dtos/createProductDto';
import { UpdateProductDto } from '../dtos/updateProductDto';
import { User } from 'src/entities/user.entity';
import { FilterDto } from 'src/dtos/filterDto';

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
      throw new NotFoundException(`Product with ID ${productId} not found`);

    return product;
  }

  async createProduct(
    createProductDto: CreateProductDto,
    photos: Express.Multer.File[],
    smallPrint: Express.Multer.File[],
    largePrint: Express.Multer.File[],
    owner: User,
  ) {
    const uploadedPhotos = await Promise.all(
      photos.map(
        async (photo) => await this.cloudinaryProvider.uploadImage(photo),
      ),
    );
    const uploadedSmallPrint = await Promise.all(
      smallPrint.map(
        async (stamp) => await this.cloudinaryProvider.uploadImage(stamp),
      ),
    );
    const uploadedLargePrint = await Promise.all(
      largePrint.map(
        async (stamp) => await this.cloudinaryProvider.uploadImage(stamp),
      ),
    );
    if (typeof createProductDto.sizes === 'string') {
      createProductDto.sizes = [createProductDto.sizes];
    }
    if (typeof createProductDto.color === 'string') {
      createProductDto.color = [createProductDto.color];
    }
    const product = this.productRepository.create({
      ...createProductDto,
      user: owner,
      photos: uploadedPhotos.map((img) => img.secure_url),
      smallPrint: uploadedSmallPrint.map((img) => img.secure_url),
      largePrint: uploadedLargePrint.map((img) => img.secure_url),
    });

    return this.productRepository.save(product);
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

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
    photos: Express.Multer.File[],
    smallPrint: Express.Multer.File[],
    largePrint: Express.Multer.File[],
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    if (photos && photos.length > 0) {
      const uploadedPhotos = await Promise.all(
        photos.map((file) => this.cloudinaryProvider.uploadImage(file)),
      );
      product.photos = [
        ...product.photos,
        ...uploadedPhotos.map((img) => img.secure_url),
      ];
    }

    if (smallPrint && smallPrint.length > 0) {
      const uploadedSmallPrint = await Promise.all(
        smallPrint.map((file) => this.cloudinaryProvider.uploadImage(file)),
      );
      product.smallPrint = [
        ...product.smallPrint,
        ...uploadedSmallPrint.map((img) => img.secure_url),
      ];
    }

    if (largePrint && largePrint.length > 0) {
      const uploadedLargePrint = await Promise.all(
        largePrint.map((file) => this.cloudinaryProvider.uploadImage(file)),
      );
      product.largePrint = [
        ...product.largePrint,
        ...uploadedLargePrint.map((img) => img.secure_url),
      ];
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

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
