import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'User ID',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({
    description: 'User firstname',
    example: 'Valkirias',
  })
  firstname: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({
    description: 'User lastname',
    example: 'Valkirias',
  })
  lastname: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  @ApiProperty({
    description: 'User email',
    example: 'valkirias@test.com',
  })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'User password',
    example: 'Valkirias123',
  })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Profile picture',
  })
  photo: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Google Token',
  })
  googleAccessToken: string;

  @Column({ default: true })
  @ApiProperty()
  active: boolean;

  @Column({ default: false })
  @ApiProperty()
  isAdmin: boolean;

  @OneToMany(() => Order, (orders) => orders.user)
  @JoinColumn({ name: 'orderId' })
  orders: Order[];

  @OneToMany(() => Product, (products) => products.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  products: Product[];
}
