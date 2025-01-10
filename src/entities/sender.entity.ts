import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderTrack } from './orderTrack.entity';

@Entity({ name: 'senders' })
export class Sender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => OrderTrack, (orderTrack) => orderTrack.sender)
  @JoinColumn({ name: 'orderTrackId' })
  orderTrack: OrderTrack;
}
