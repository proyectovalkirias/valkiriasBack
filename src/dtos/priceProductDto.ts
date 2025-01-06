import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PriceProductDto {
  @ApiProperty({
    description: 'Price for size',
  })
  @IsNumber()
  price: string;

  @ApiProperty({
    description: 'Product size',
  })
  size: string;
}
