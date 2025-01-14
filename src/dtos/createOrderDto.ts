import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
      { id: '550e8400-e29b-41d4-a716-446655440000', size: 'M', quantity: 2 },
      { id: '550e8400-e29b-41d4-a716-446655440001', size: 'L', quantity: 1 },
    ],
  })
  @IsArray()
  products: { id: string; size: string, quantity: number }[];

  @ApiProperty({
    description: 'addressId',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty()
  addressId: string;
}
