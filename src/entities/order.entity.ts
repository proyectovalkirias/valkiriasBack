import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OrderDetail } from './orderDetails.entity';
import { OrderStatus } from 'src/utils/orderStatus.enum';
import { Address } from './address.entity';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Order id',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Order creation date',
  })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @ApiProperty({
    description: 'Order Status',
    example: 'pendiente',
  })
  status: OrderStatus;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'Order last update date',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Address, (address) => address.orders, { nullable: false })
  @JoinColumn({ name: 'userAddressId'})
  @ApiProperty({
    description: 'Address selected for the order',
  })
  userAddress: Address;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  orderDetail: OrderDetail;

}
