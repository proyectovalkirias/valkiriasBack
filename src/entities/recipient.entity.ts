// import {
//   Column,
//   Entity,
//   JoinColumn,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { OrderTrack } from './orderTrack.entity';

// @Entity({ name: 'recipients' })
// export class Recipient {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @OneToOne(() => OrderTrack, (orderTrack) => orderTrack.recipient)
//   @JoinColumn({ name: 'orderTrackId' })
//   orderTrack: OrderTrack;

//   @Column({ type: 'varchar' })
//   name: string;

//   @Column({ type: 'varchar' })
//   destinationCity: string;

//   @Column({ type: 'varchar' })
//   address: string;

//   @Column({ type: 'varchar' })
//   contactName: string;
// }
