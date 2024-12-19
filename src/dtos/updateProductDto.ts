import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  price?: number;

  @IsString()
  @IsOptional()
  sizes?: string[];

  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  stamped?: string;

  @IsNumber()
  @IsOptional()
  stock?: number;
}
