import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Address } from './address.entity';

@Entity({
  name: 'orderDetails',
})
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Order Detail Id',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  @ApiProperty({
    description: 'Price',
  })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    description: 'Size selected for the product',
  })
  size: string;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({
    description: 'Quantity of product',
  })
  quantity: number;

  @OneToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn({
    name: 'orderId',
  })
  order: Order;

  @ManyToMany(() => Product)
  @JoinTable({ name: 'orderDetail_product' })
  product: Product[];

  @ManyToOne(() => Address, { nullable: false })
  @JoinColumn({ name: 'userAddressId' })
  @ApiProperty({
    description: 'Address selected for the order',
  })
  address: Address;
}
