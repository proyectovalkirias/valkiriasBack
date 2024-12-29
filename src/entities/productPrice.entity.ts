import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('productPrice')
export class ProductPrice {
    @ApiProperty({
        description: 'Product Price Id'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Product price'
    })
    @Column({type: 'decimal', precision: 10, scale: 2})
    price: number;

    @ApiProperty({
        description: 'Product sizes'
    })
    @Column()
    size: string;

    @ManyToOne(() => Product, (product) => product.prices)
    @JoinColumn({ name: 'productId'})
    product: Product;
}