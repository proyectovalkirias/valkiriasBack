// import {
//   Column,
//   Entity,
//   JoinColumn,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { OrderTrack } from './orderTrack.entity';
// import { ApiProperty } from '@nestjs/swagger';

// @Entity({ name: 'mailAddress' })
// export class MailAddress {
//   @PrimaryGeneratedColumn('uuid')
//   @ApiProperty({
//     description: 'Sender id',
//     format: 'uuid',
//     example: '550e8400-e29b-41d4-a716-446655440000',
//   })
//   id: string;

//   @OneToOne(() => OrderTrack, (orderTrack) => orderTrack.sender)
//   @JoinColumn({ name: 'orderTrackId' })
//   orderTrack: OrderTrack;
  
//   @Column({ nullable: true })
//    @ApiProperty({
//       description: 'Calle',
//       example: 'Juan Bautista Alberdi',
//       nullable: true,
//     })
//     street: string;
  
//     @Column({ nullable: true })
//     @ApiProperty({ 
//       nullable: true,
//       description: "Numero de la Calle"
//     })
//     number: number;
  
//     @Column({ nullable: true})
//     @ApiProperty({
//       nullable: true,
//       description: "Codigo postal"
//     })
//     postalCode: string;
  
//     @Column({ nullable: true })
//     @ApiProperty({
//       description: 'User City',
//       example: 'Springfield',
//     })
//     city: string;
  
//     @Column({ nullable: true })
//     @ApiProperty({
//       description: 'User State',
//       example: 'Buenos Aires',
//     })
//     state: string;
  
//     @Column({ 
//       type: 'float' ,
//       nullable: true })
//     @ApiProperty({
//       description: 'Coordenada Longitud'
//     })
//     longitude: number;
  
//     @Column({
//       type: 'float',
//       nullable: true })
//     @ApiProperty({
//       description: 'Coordenada Latitud'
//     })
//     latitude: number;
// }