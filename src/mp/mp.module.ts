import { forwardRef, Module } from '@nestjs/common';
import { MpController } from './mp.controller';
import { MpService } from './mp.service';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    TypeOrmModule.forFeature([Order]),
     ProductModule],
  controllers: [MpController],
  providers: [MpService],
  exports: [MpService],
})
export class MpModule {}
