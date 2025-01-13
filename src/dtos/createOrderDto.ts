import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { Product } from 'src/entities/product.entity';

export class CreateOrderDto {
  @ApiProperty({
    description: 'User id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Products',
    example: [
      { id: '550e8400-e29b-41d4-a716-446655440000', size: 'M' },
      { id: '550e8400-e29b-41d4-a716-446655440001', size: 'L' },
    ],
  })
  @IsArray()
  products: { id: string; size: string, quantity: number }[];
}
