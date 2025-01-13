// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Order } from './order.entity';
// import { ApiProperty } from '@nestjs/swagger';
// import { Sender } from './sender.entity';
// import { Recipient } from './recipient.entity';
// import { OrderStatus } from 'src/utils/orderStatus.enum';
// import { Address } from './address.entity';
// import MailMessage from 'nodemailer/lib/mailer/mail-message';
// import { MailAddress } from './mail.entity';

// @Entity({ name: 'orderTracks' })
// export class OrderTrack {
//   @PrimaryGeneratedColumn('uuid')
//   @ApiProperty({
//     description: 'Order track id',
//     format: 'uuid',
//     example: '550e8400-e29b-41d4-a716-446655440000',
//   })
//   id: string;

//   @OneToOne(() => Order, (order) => order.orderTrack)
//   @JoinColumn({
//     name: 'orderId',
//   })
//   order: Order;
  
//   // @ManyToOne(() => Address, { nullable: true })
//   // userAddress: Address;  

//   @Column({ type: 'enum', enum: OrderStatus })
//   status: OrderStatus;

//   @CreateDateColumn()
//   changeDate: Date;


//   @OneToOne(() => Sender, (sender) => sender.orderTrack, {
//     cascade: true,
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({
//     name: 'senderId',
//   })
//   sender: Sender;

//   @OneToOne(() => Recipient, (recipient) => recipient.orderTrack, {
//     cascade: true,
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({
//     name: 'recipientId',
//   })
//   recipient: Recipient;

//   @OneToOne(() => MailAddress, (mailAddress) => mailAddress.orderTrack, {
//     cascade: true,
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({
//     name: 'mailAddressId',
//   })
//   mailAddress: MailAddress;
// }
