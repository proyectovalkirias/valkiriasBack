import { Module } from '@nestjs/common';
import { MpController } from './mp.controller';
import { MpService } from './mp.service';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [ProductModule],
  controllers: [MpController],
  providers: [MpService],
  exports: [MpService],
})
export class MpModule {}
