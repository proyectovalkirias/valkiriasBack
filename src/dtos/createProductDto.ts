import { ApiProperty, ApiSchema } from '@nestjs/swagger';
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

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Remera',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Remera algodón',
  })
  @IsNotEmpty()
  @Length(10, 150)
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Product sizes',
    example: ['S', 'M', 'L'],
    nullable: true,
    default: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  sizes?: string[];

  @ApiProperty({
    description: 'Product color',
    example: ['Blanco', 'Negro'],
    nullable: true,
    default: null,
    required: false,
  })
  @IsOptional()
  color?: string[];

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
  /* @IsArray() */
  @IsOptional()
  smallPrint?: string[] | null;

  @ApiProperty({
    description: 'Product large print',
    nullable: true,
    default: null,
    required: false,
  })
  /* @IsArray() */
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
}
