import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
// import { Order } from "./order.entity";
import { OrderDetail } from "./orderDetails.entity";


@Entity({ name: 'addresses'}) 
    export class Address {

        @PrimaryGeneratedColumn('uuid')
        id: string;
        
        @Column({ nullable: true })
         @ApiProperty({
            description: 'Calle',
            example: 'Juan Bautista Alberdi',
            nullable: true,
          })
          street: string;
        
          @Column({ nullable: true })
          @ApiProperty({ 
            nullable: true,
            description: "Numero de la Calle"
          })
          number: number;
        
          @Column({ nullable: true})
          @ApiProperty({
            nullable: true,
            description: "Codigo postal"
          })
          postalCode: string;
        
          @Column({ nullable: true })
          @ApiProperty({
            description: 'User City',
            example: 'Springfield',
          })
          city: string;
        
          @Column({ nullable: true })
          @ApiProperty({
            description: 'User State',
            example: 'Buenos Aires',
          })
          state: string;
        
          @Column({ 
            type: 'float' ,
            nullable: true })
          @ApiProperty({
            description: 'Coordenada Longitud'
          })
          longitude: number;
        
          @Column({
            type: 'float',
            nullable: true })
          @ApiProperty({
            description: 'Coordenada Latitud'
          })
          latitude: number;

          @ManyToOne(() => User, (user) => user.addresses)
           user: User;

          // @OneToMany(() => Order, (order) => order.userAddress)
          // orders: Order[];

          @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.address)
          @ApiProperty({
            description: 'Address user',
          })
          orderDetails: OrderDetail[]

    }
    

