import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { text } from 'body-parser';
import { IsOptional } from 'class-validator';

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
    example: 'Remera de algodón',
  })
  name: string;

  @Column({ type: 'varchar' })
  @ApiProperty({
    description: 'Product description',
  })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({
    description: 'Product price',
    example: 1000.0,
  })
  price: number;

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
}
