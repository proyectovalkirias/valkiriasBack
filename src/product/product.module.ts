import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { MpModule } from 'src/mp/mp.module';
import { ProductPrice } from 'src/entities/productPrice.entity';
import { CloudinaryConfig, CloudinaryService } from 'src/config/cloudinary';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductPrice])],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService /* CloudinaryConfig */],
  exports: [ProductService],
})
export class ProductModule {
  constructor() {
    console.log('Product module cargado.');
  }
}
