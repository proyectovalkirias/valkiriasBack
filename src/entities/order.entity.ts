import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @Column()
  @ApiProperty({
    description: 'Order date',
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

  @Column()
  @ApiProperty({
    description: 'Update Order Status',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Address, { nullable: true })
  userAddress: Address;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  orderDetail: OrderDetail;

}
