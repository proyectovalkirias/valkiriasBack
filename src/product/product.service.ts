import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CloudinaryService } from '../config/cloudinary';
import { CreateProductDto } from '../dtos/createProductDto';
import { UpdateProductDto } from '../dtos/updateProductDto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cloudinaryProvider: CloudinaryService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const uploadedImages = await Promise.all(
      files.map((file) => this.cloudinaryProvider.uploadImage(file)),
    );

    const product = this.productRepository.create({
      ...createProductDto,
      photos: uploadedImages.map((img) => img.secure_url),
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
    files?: Express.Multer.File[],
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${productId} not found`);

    if (files && files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map((file) => this.cloudinaryProvider.uploadImage(file)),
      );
      product.photos = [
        ...product.photos,
        ...uploadedImages.map((img) => img.secure_url),
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
}
