import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, OrderedBulkOperation, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { OrderDetail } from "./orderDetails.entity";

@Entity({
    name: 'orders'
})
export class Order {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'Order id',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    id: string;

    @Column()
    @ApiProperty({
        description: 'Order date'
    })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.orders, {nullable: false})
    @JoinColumn({ name: 'userId'})
    user: User;

    @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order )
    orderDetail: OrderDetail;
}