import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Remera',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Remera algodón',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 150)
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 100,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Product sizes',
    example: ['S', 'M', 'L'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsOptional()
  sizes?: string[];

  @ApiProperty({
    description: 'Product color',
    example: ['Blanco', 'Negro'],
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  color?: string[];

  @ApiProperty({
    description: 'Product category',
    example: 'Remeras',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Product small print',
    required: false,
  })
  @IsArray()
  @IsOptional()
  smallPrint?: string[];

  @ApiProperty({
    description: 'Product large print',
    required: false,
  })
  @IsArray()
  @IsOptional()
  LargePrint?: string[];

  @ApiProperty({
    description: 'Product photos',
    required: false,
  })
  @IsArray()
  @IsOptional()
  photos?: string[];

  @ApiProperty({
    description: 'Product stock',
    required: false,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Product available',
    required: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
