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
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Remera algodón',
    required: false,
  })
  @IsString()
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
    type: [String],
    isArray: true,
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  sizes?: string[] | string;

  @ApiProperty({
    description: 'Product color',
    example: ['Blanco', 'Negro'],
    type: [String],
    isArray: true,
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  color?: string[] | string;

  @ApiProperty({
    description: 'Product category',
    example: 'Remeras',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Product small print',
    required: false,
  })
  @IsOptional()
  smallPrint?: string[];

  @ApiProperty({
    description: 'Product large print',
    required: false,
  })
  @IsOptional()
  largePrint?: string[];

  @ApiProperty({
    description: 'Product photos',
    required: false,
  })
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
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
