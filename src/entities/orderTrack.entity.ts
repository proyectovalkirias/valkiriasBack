import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Sender } from './sender.entity';
import { Recipient } from './recipient.entity';

@Entity({ name: 'orderTracks' })
export class OrderTrack {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Order track id',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @OneToOne(() => Order, (order) => order.orderTrack)
  @JoinColumn({
    name: 'orderId',
  })
  order: Order;

  @OneToOne(() => Sender, (sender) => sender.orderTrack, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'senderId',
  })
  sender: Sender;

  @OneToOne(() => Recipient, (recipient) => recipient.orderTrack, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'recipientId',
  })
  recipient: Recipient;
}
