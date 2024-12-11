import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({
    name: 'categories'
})
export class Category {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: 'Category Id',
        format: 'uuid',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    id: string;

    @Column({type: 'varchar', length: 50, nullable: false, unique: true})
    @ApiProperty({
        description: 'Category name',
        example: 'Remera'
    })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    @JoinColumn()
    product: Product;
}