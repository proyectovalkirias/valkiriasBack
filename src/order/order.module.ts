import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderDetails.entity';
import { UserModule } from 'src/user/user.module';
import { ProductPrice } from 'src/entities/productPrice.entity';
import { MpModule } from 'src/mp/mp.module';
import { OrderTrack } from 'src/entities/orderTrack.entity';

@Module({
  imports: [
    forwardRef(() => MpModule),
    TypeOrmModule.forFeature([
      Product, 
      User, 
      Order, 
      OrderDetail, 
      ProductPrice, 
      OrderTrack]),
    UserModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
