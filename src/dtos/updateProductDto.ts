import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  @IsString()
  price?: number;

  @IsString()
  @IsNotEmpty()
  sizes?: string[];

  
  @IsNotEmpty()
  color?: string;

  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsNotEmpty()
  @IsBoolean()
  isAvailable?: boolean;

  @IsString()
  stamped?: string;

  @IsNumber()
  stock?: number;
}
