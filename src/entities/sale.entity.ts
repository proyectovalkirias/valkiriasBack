import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, (product) => product.sales)
    @JoinColumn({ name: 'productId'})
    product: Product;

    @Column({ type: 'int'})
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    priceUnit: number;

    @Column()
    createAt: Date;

}