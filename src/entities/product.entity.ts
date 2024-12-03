import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId'})
  @ApiProperty()
  user: User;
  
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', array: true })
  sizes: string[];

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'text', array: true, nullable: true })
  photos: string[];

}
