import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Sale } from 'src/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]),],
  providers: [SaleService],
  controllers: [SaleController],
})
export class SaleModule {}
