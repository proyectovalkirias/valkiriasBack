import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateProductDto {

  @ApiProperty({
    description: 'Product name',
    example: 'Remera'
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  name?: string;


  @ApiProperty({
    description: 'Product description',
    example: 'Remera algodón'
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 150)
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 100
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  price: number;


  @ApiProperty({
    description: 'Product sizes',
    example: ['S', 'M', 'L']
  })
  @IsString()
  @IsNotEmpty()
  sizes?: string[];


  @ApiProperty({
    description: 'Product color',
    example: ['Blanco', 'Negro']
  })
  @IsNotEmpty()
  color?: string[];

  @ApiProperty({
    description: 'Product category',
    example: 'Remeras'
  })
  @IsString()
  @IsNotEmpty()
  category?: string;

  
  @ApiProperty({
    description: 'Product small print'
  })
  @IsArray()
  smallPrint?: string[];
  
  @ApiProperty({
    description: 'Product large print'
  })
  @IsArray()
  LargePrint?: string[];
  
  @ApiProperty({
    description: 'Product photos'
  })
  @IsArray()
  photo?: string[];
  
  @ApiProperty({
    description: 'Product stock'
  })
  @IsNumber()
  @Type(() => Number)
  stock: number;
  
  @ApiProperty({
    description: 'Product available',
  })
  @IsNotEmpty()
  @IsBoolean()
  isAvailable?: boolean;
}
