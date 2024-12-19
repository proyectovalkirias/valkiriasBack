import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  @IsNotEmpty()
  @Length(10, 100)
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  sizes: string[];

  @IsNotEmpty()
  color: string[];

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsString()
  stamped: string;

  @IsNumber()
  @Type(() => Number)
  stock: number;
}
