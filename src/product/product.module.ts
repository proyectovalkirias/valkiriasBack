import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { CloudinaryConfig, CloudinaryService } from 'src/config/cloudinary';
import { MpModule } from 'src/mp/mp.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService, CloudinaryConfig],
  exports: [ProductService],
})
export class ProductModule {}
