import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { PriceProductDto } from './priceProductDto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Remera',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Remera algodón',
  })
  @IsNotEmpty()
  @Length(2, 150)
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    nullable: true,
  })
  @IsString({ each: true })
  prices: { size: string; price: number }[]; 

  @ApiProperty({
    description: 'Product sizes',
    example: ['16', 'S', 'M', 'L'],
    type: [String],
    isArray: true,
    nullable: true,
    default: null,
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  size?: string[] | string;

  @ApiProperty({
    description: 'Product color',
    example: ['Blanco', 'Negro'],
    type: [String],
    isArray: true,
    nullable: true,
    default: null,
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  color?: string[] | string;

  @ApiProperty({
    description: 'Product category',
    example: 'Remeras',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Product small print',
    nullable: true,
    default: null,
    required: false,
  })
  @IsOptional()
  smallPrint?: string[] | null;

  @ApiProperty({
    description: 'Product large print',
    nullable: true,
    default: null,
    required: false,
  })
  @IsOptional()
  largePrint?: string[] | null;

  @ApiProperty({
    description: 'Product photos',
    required: false,
  })
  @IsArray()
  @IsOptional()
  photos?: string[];

  @ApiProperty({
    description: 'Product stock',
  })
  @IsNumber()
  @Type(() => Number)
  stock: number;

  @ApiProperty({
    description: 'Product available',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true') 
  isCustomizable: boolean;

  // @IsString()
  // @IsOptional()
  // imagePrint?: string | null;
  
  // @IsString()
  // @IsOptional()
  // ideas?: string | null;
}

