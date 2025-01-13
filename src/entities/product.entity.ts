import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductPrice } from './productPrice.entity';
import { Sale } from './sale.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId' })
  @ApiProperty()
  user: User;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({
    description: 'Product name',
    example: 'Remera de algodÃ³n',
  })
  name: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Product description',
  })
  description: string;


  @Column('jsonb', { nullable: true })
  prices: ProductPrice[];

  @Column({ type: 'text', array: true, nullable: true })
  @ApiProperty({
    description: 'Product size',
  })
  sizes?: string[];

  @Column({ type: 'text', array: true, nullable: true })
  @ApiProperty({
    description: 'Product color',
  })
  color?: string[];

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    description: 'Product available',
  })
  isAvailable: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: 'Customization Available',
  })
  isCustomizable: boolean;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({
    description: 'Product Category',
  })
  category: string;

  @Column({ type: 'text', array: true, nullable: true })
  @ApiProperty({
    description: 'Product images',
  })
  photos: string[];

  @Column({ type: 'text', array: true, nullable: true })
  @ApiProperty({
    description: 'Choice of Stamping Area',
  })
  smallPrint?: string[];

  @Column({ type: 'text', array: true, nullable: true })
  @ApiProperty({
    description: 'Product images',
  })
  largePrint?: string[];

  @Column({ type: 'int', nullable: true })
  @ApiProperty({
    description: 'Stock',
  })
  stock: number;

  @OneToMany(() => Sale, (sale) => sale.product)
  sales: Sale[];

  @Column({ nullable: true, default: null })
  imagePrint?: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  ideas?: string | null;
}